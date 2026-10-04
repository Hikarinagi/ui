import { createRef, type ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render, type RenderResult } from 'vitest-browser-react'
import { ConfigProvider } from '../../lib/config'
import { Stepper } from './Stepper'
import type { StepperExpose, StepperOrientation, StepperProps } from './types'
import '../../../test/browser.css'

const screens: RenderResult[] = []
const items = [{ title: 'First' }, { title: 'Second' }, { title: 'Third' }]
afterEach(async () => {
  for (const screen of screens.splice(0)) await screen.unmount()
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('dir')
})
function rect(element: Element) {
  return element.getBoundingClientRect()
}
async function mount(ui: ReactNode) {
  const screen = await render(ui)
  screens.push(screen)
  const element = screen.container.firstElementChild as HTMLElement
  return {
    screen,
    element,
    find: (selector: string) =>
      (element.matches(selector) ? element : element.querySelector(selector)) as HTMLElement,
    findAll: (selector: string) => Array.from(element.querySelectorAll<HTMLElement>(selector)),
  }
}
async function mountStepper(props: Partial<StepperProps>) {
  const vm = createRef<StepperExpose>()
  let current = props
  const ui = () => <Stepper items={items} {...current} ref={vm} />
  const wrapper = await mount(ui())
  return {
    ...wrapper,
    vm: () => vm.current!,
    setProps: async (next: Partial<StepperProps>) => {
      current = { ...current, ...next }
      await wrapper.screen.rerender(ui())
    },
  }
}

const layouts = (['horizontal', 'vertical'] as StepperOrientation[]).flatMap(orientation =>
  (['ltr', 'rtl'] as const).flatMap(dir => [280, 720].map(width => ({ orientation, dir, width }))),
)

describe('Stepper browser behavior', () => {
  it.each(layouts)(
    'aligns markers, connects steps and wraps content ($orientation / $dir / $width)',
    async ({ orientation, dir, width }) => {
      await page.viewport(900, 800)
      const wrapper = await mountStepper({
        items: items.map((item, index) => ({
          ...item,
          description: index === 1 ? 'LongUnbrokenDescription'.repeat(8) : 'Short text',
        })),
        orientation,
        dir,
        className: 'w-full',
        style: { width: `${width}px` },
      })
      const root = wrapper.element
      const buttons = wrapper.findAll('button')
      const indicators = buttons.map(button =>
        button.querySelector('[aria-hidden=true]:not(.hn-ripple)')!,
      )
      const lines = wrapper.findAll('.hn-stepper-separator')
      expect(root.scrollWidth).toBeLessThanOrEqual(width + 1)
      for (const button of buttons) {
        expect(rect(button).left).toBeGreaterThanOrEqual(rect(root).left - 1)
        expect(rect(button).right).toBeLessThanOrEqual(rect(root).right + 1)
      }
      expect(lines).toHaveLength(2)
      for (let i = 0; i < 2; i++) {
        const a = rect(indicators[i]!)
        const b = rect(indicators[i + 1]!)
        const line = rect(lines[i]!)
        if (orientation === 'horizontal') {
          expect(Math.abs(a.top - b.top)).toBeLessThan(1)
          expect(Math.abs(line.top + line.height / 2 - a.top - a.height / 2)).toBeLessThan(1)
          expect(line.width).toBeGreaterThan(0)
          expect(line.left).toBeGreaterThan(dir === 'ltr' ? a.right : b.right)
          expect(line.right).toBeLessThan(dir === 'ltr' ? b.left : a.left)
        } else {
          expect(Math.abs(a.left - b.left)).toBeLessThan(1)
          expect(Math.abs(line.left + line.width / 2 - a.left - a.width / 2)).toBeLessThan(1)
          expect(line.top).toBeGreaterThanOrEqual(rect(buttons[i]!).bottom)
          expect(line.bottom).toBeLessThanOrEqual(rect(buttons[i + 1]!).top)
        }
      }
      const announcements = Array.from(root.querySelectorAll('[role=status]')).filter(
        element => getComputedStyle(element).display !== 'none',
      )
      expect(announcements).toHaveLength(1)
      expect(announcements[0]!.textContent).toContain('第 1 步，共 3 步')
    },
  )

  it.each(['ltr', 'rtl'] as const)(
    'navigates horizontal steps with keys, skips disabled steps and does not activate on focus (%s)',
    async dir => {
      document.documentElement.dir = dir
      const wrapper = await mountStepper({
        items: [items[0]!, { ...items[1]!, disabled: true }, items[2]!],
        linear: false,
      })
      const buttons = wrapper.findAll('button')
      buttons[0]!.focus()
      await userEvent.keyboard(dir === 'rtl' ? '{ArrowLeft}' : '{ArrowRight}')
      expect(document.activeElement).toBe(buttons[2])
      expect(wrapper.vm().step).toBe(1)
      await userEvent.keyboard('{Enter}')
      await vi.waitFor(() => expect(wrapper.vm().step).toBe(3))
      await userEvent.keyboard(dir === 'rtl' ? '{ArrowRight}' : '{ArrowLeft}')
      expect(document.activeElement).toBe(buttons[0])
      await userEvent.keyboard(' ')
      await vi.waitFor(() => expect(wrapper.vm().step).toBe(1))
    },
  )

  it('uses up and down for vertical navigation and respects linear boundaries', async () => {
    const wrapper = await mountStepper({ items, orientation: 'vertical' })
    const buttons = wrapper.findAll('button')
    buttons[0]!.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(buttons[1])
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(buttons[1])
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(buttons[2])
    await userEvent.keyboard('{ArrowUp}')
    expect(document.activeElement).toBe(buttons[1])
  })

  it('inherits configuration direction and responds to an explicit direction change', async () => {
    const ui = (dir: 'rtl' | 'ltr') => (
      <ConfigProvider dir={dir}>
        <Stepper items={items} linear={false} />
      </ConfigProvider>
    )
    const wrapper = await mount(ui('rtl'))
    const buttons = wrapper.findAll('button')
    buttons[0]!.focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(document.activeElement).toBe(buttons[1])
    await wrapper.screen.rerender(ui('ltr'))
    await vi.waitFor(() =>
      expect(wrapper.find('[data-hn-stepper]').getAttribute('dir')).toBe('ltr'),
    )
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(buttons[2])
  })

  it('routes pointer, native click, keyboard and content controls through the same guard', async () => {
    let resolve!: (allowed: boolean) => void
    const beforeChange = vi.fn(
      () =>
        new Promise<boolean>(yes => {
          resolve = yes
        }),
    )
    const wrapper = await mountStepper({
      items,
      beforeChange,
      children: ({ next, canNext }) => (
        <button type="button" disabled={!canNext} onClick={next}>
          Next
        </button>
      ),
    })
    await userEvent.click(wrapper.findAll('button')[1]!)
    expect(beforeChange).toHaveBeenCalledTimes(1)
    expect(wrapper.vm().step).toBe(1)
    expect(wrapper.vm().pending).toBe(true)
    wrapper.findAll('button')[1]!.click()
    expect(beforeChange).toHaveBeenCalledTimes(1)
    resolve(false)
    await vi.waitFor(() => expect(wrapper.vm().pending).toBe(false))
    wrapper.findAll('button')[1]!.click()
    await vi.waitFor(() => expect(beforeChange).toHaveBeenCalledTimes(2))
    resolve(true)
    await vi.waitFor(() => expect(wrapper.vm().step).toBe(2))
    wrapper.findAll('button')[2]!.focus()
    await userEvent.keyboard('{Enter}')
    expect(beforeChange).toHaveBeenCalledTimes(3)
    resolve(false)
    await vi.waitFor(() => expect(wrapper.vm().pending).toBe(false))
    await userEvent.click(wrapper.findAll('button')[3]!)
    expect(beforeChange).toHaveBeenCalledTimes(4)
    resolve(true)
    await vi.waitFor(() => expect(wrapper.vm().step).toBe(3))
  })

  it('never submits a containing form and keeps content controls in the tab order', async () => {
    const submitted = vi.fn()
    const wrapper = await mount(
      <form
        onSubmit={event => {
          event.preventDefault()
          submitted()
        }}
      >
        <Stepper items={items}>
          <input aria-label="Content" />
        </Stepper>
      </form>,
    )
    const buttons = wrapper.findAll('button')
    await userEvent.click(buttons[1]!)
    expect(submitted).not.toHaveBeenCalled()
    buttons[2]!.focus()
    await userEvent.tab()
    expect(document.activeElement).toBe(wrapper.find('input'))
  })

  it('colors completed connectors and removes the fill when the step has an error', async () => {
    const wrapper = await mountStepper({ items, defaultValue: 2 })
    const line = wrapper.find('.hn-stepper-separator')
    const active = wrapper
      .findAll('button')[1]!
      .querySelector('[aria-hidden=true]:not(.hn-ripple)')!
    await vi.waitFor(() =>
      expect(getComputedStyle(line).backgroundColor).toBe(getComputedStyle(active).backgroundColor),
    )
    await wrapper.setProps({ items: items.map((item, index) => ({ ...item, error: index === 0 })) })
    await vi.waitFor(() =>
      expect(getComputedStyle(line).backgroundColor).not.toBe(
        getComputedStyle(active).backgroundColor,
      ),
    )
  })
})
