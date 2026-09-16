import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import { page, userEvent } from 'vitest/browser'
import { ConfigProvider } from 'reka-ui'
import Stepper from './Stepper.vue'
import type { StepperNavigation, StepperOrientation } from './types'
import '../../../test/browser.css'

const wrappers: VueWrapper[] = []
const items = [{ title: 'First' }, { title: 'Second' }, { title: 'Third' }]
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('dir')
})
function rect(element: Element) {
  return element.getBoundingClientRect()
}

const layouts = (['horizontal', 'vertical'] as StepperOrientation[]).flatMap(orientation =>
  (['ltr', 'rtl'] as const).flatMap(dir => [280, 720].map(width => ({ orientation, dir, width }))),
)

describe('Stepper browser behavior', () => {
  it.each(layouts)(
    'aligns markers, connects steps and wraps content ($orientation / $dir / $width)',
    async ({ orientation, dir, width }) => {
      await page.viewport(900, 800)
      const wrapper = mount(Stepper, {
        attachTo: document.body,
        props: {
          items: items.map((item, index) => ({
            ...item,
            description: index === 1 ? 'LongUnbrokenDescription'.repeat(8) : 'Short text',
          })),
          orientation,
          dir,
          class: 'w-full',
        },
        attrs: { style: `width: ${width}px` },
      })
      wrappers.push(wrapper)
      const root = wrapper.element as HTMLElement
      const buttons = wrapper.findAll('button').map(button => button.element)
      const indicators = buttons.map(button =>
        button.querySelector('[aria-hidden=true]:not(.hn-ripple)')!,
      )
      const lines = wrapper.findAll('.hn-stepper-separator').map(line => line.element)
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
      const wrapper = mount(Stepper, {
        attachTo: document.body,
        props: { items: [items[0]!, { ...items[1]!, disabled: true }, items[2]!], linear: false },
      })
      wrappers.push(wrapper)
      const buttons = wrapper.findAll('button').map(button => button.element)
      buttons[0]!.focus()
      await userEvent.keyboard(dir === 'rtl' ? '{ArrowLeft}' : '{ArrowRight}')
      expect(document.activeElement).toBe(buttons[2])
      expect(wrapper.vm.step).toBe(1)
      await userEvent.keyboard('{Enter}')
      await vi.waitFor(() => expect(wrapper.vm.step).toBe(3))
      await userEvent.keyboard(dir === 'rtl' ? '{ArrowRight}' : '{ArrowLeft}')
      expect(document.activeElement).toBe(buttons[0])
      await userEvent.keyboard(' ')
      await vi.waitFor(() => expect(wrapper.vm.step).toBe(1))
    },
  )

  it('uses up and down for vertical navigation and respects linear boundaries', async () => {
    const wrapper = mount(Stepper, {
      attachTo: document.body,
      props: { items, orientation: 'vertical' },
    })
    wrappers.push(wrapper)
    const buttons = wrapper.findAll('button').map(button => button.element)
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
    const dir = ref<'rtl' | 'ltr'>('rtl')
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(ConfigProvider, { dir: dir.value }, () => h(Stepper, { items, linear: false })),
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    const buttons = wrapper.findAll('button').map(button => button.element)
    buttons[0]!.focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(document.activeElement).toBe(buttons[1])
    dir.value = 'ltr'
    await vi.waitFor(() => expect(wrapper.find('[data-hn-stepper]').attributes('dir')).toBe('ltr'))
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
    const wrapper = mount(Stepper, {
      attachTo: document.body,
      props: { items, beforeChange },
      slots: {
        default: ({ next, canNext }: StepperNavigation) =>
          h('button', { type: 'button', disabled: !canNext, onClick: next }, 'Next'),
      },
    })
    wrappers.push(wrapper)
    await userEvent.click(wrapper.findAll('button')[1]!.element)
    expect(beforeChange).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.step).toBe(1)
    expect(wrapper.vm.pending).toBe(true)
    wrapper.findAll('button')[1]!.element.click()
    expect(beforeChange).toHaveBeenCalledTimes(1)
    resolve(false)
    await vi.waitFor(() => expect(wrapper.vm.pending).toBe(false))
    wrapper.findAll('button')[1]!.element.click()
    await vi.waitFor(() => expect(beforeChange).toHaveBeenCalledTimes(2))
    resolve(true)
    await vi.waitFor(() => expect(wrapper.vm.step).toBe(2))
    wrapper.findAll('button')[2]!.element.focus()
    await userEvent.keyboard('{Enter}')
    expect(beforeChange).toHaveBeenCalledTimes(3)
    resolve(false)
    await vi.waitFor(() => expect(wrapper.vm.pending).toBe(false))
    await userEvent.click(wrapper.findAll('button')[3]!.element)
    expect(beforeChange).toHaveBeenCalledTimes(4)
    resolve(true)
    await vi.waitFor(() => expect(wrapper.vm.step).toBe(3))
  })

  it('never submits a containing form and keeps content controls in the tab order', async () => {
    const submitted = vi.fn()
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(
            'form',
            {
              onSubmit: (event: Event) => {
                event.preventDefault()
                submitted()
              },
            },
            [h(Stepper, { items }, { default: () => h('input', { 'aria-label': 'Content' }) })],
          ),
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    const buttons = wrapper.findAll('button')
    await userEvent.click(buttons[1]!.element)
    expect(submitted).not.toHaveBeenCalled()
    buttons[2]!.element.focus()
    await userEvent.tab()
    expect(document.activeElement).toBe(wrapper.find('input').element)
  })

  it('colors completed connectors and removes the fill when the step has an error', async () => {
    const wrapper = mount(Stepper, { attachTo: document.body, props: { items, defaultValue: 2 } })
    wrappers.push(wrapper)
    const line = wrapper.find('.hn-stepper-separator').element
    const active = wrapper
      .findAll('button')[1]!
      .element.querySelector('[aria-hidden=true]:not(.hn-ripple)')!
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
