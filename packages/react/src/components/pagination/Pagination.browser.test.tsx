import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { cleanup, render as mount } from 'vitest-browser-react'
import { Pagination, type PaginationProps } from './Pagination'
import { Button } from '../button/Button'
import { ConfigProvider } from '../../lib/config'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})
afterEach(async () => {
  await cleanup()
})

type Props = Partial<PaginationProps>

async function render(props: Props = {}, container?: HTMLElement) {
  const state = signal<Props>({ total: 200, value: 1, ...props })
  const updates = vi.fn()
  function Harness() {
    const current = state.use()
    return (
      <Pagination
        total={200}
        {...current}
        onValueChange={value => {
          updates(value)
          state.value = { ...state.value, value }
        }}
      />
    )
  }
  const host = container ?? document.body.appendChild(document.createElement('div'))
  await mount(<Harness />, { container: host })
  const element = host.firstElementChild as HTMLElement
  return {
    element,
    updates,
    find: (selector: string) => element.querySelector<HTMLElement>(selector),
    findAll: (selector: string) => [...element.querySelectorAll<HTMLElement>(selector)],
    async setProps(next: Props) {
      state.value = { ...state.value, ...next }
      await tick()
    },
  }
}

type Wrapper = Awaited<ReturnType<typeof render>>

function action(w: Wrapper, name: string) {
  return w.find('[data-hn-pagination-action="' + name + '"]') as HTMLButtonElement
}
const selected = (w: Wrapper) => w.find('[aria-current="page"]')!.textContent

describe('Pagination interactions', () => {
  it('changes pages from every control and keeps a single selected page', async () => {
    const w = await render({ showFirstLast: true })
    await userEvent.click(action(w, 'next'))
    expect(selected(w)).toBe('2')
    await userEvent.click(w.find('[data-type="page"][aria-label="第 4 页"]')!)
    expect(selected(w)).toBe('4')
    await userEvent.click(action(w, 'prev'))
    expect(selected(w)).toBe('3')
    await userEvent.click(action(w, 'last'))
    expect(selected(w)).toBe('20')
    expect(action(w, 'last').disabled).toBe(true)
    await userEvent.click(action(w, 'first'))
    expect(selected(w)).toBe('1')
    expect(action(w, 'prev').disabled).toBe(true)
    expect(w.findAll('[aria-current="page"]')).toHaveLength(1)
  })

  it('supports Tab, Enter and Space without submitting an enclosing form', async () => {
    const submit = vi.fn()
    const container = document.createElement('form')
    container.addEventListener('submit', event => {
      event.preventDefault()
      submit()
    })
    document.body.append(container)
    const w = await render({}, container)
    await userEvent.tab()
    expect(document.activeElement).toBe(w.find('[aria-current="page"]'))
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    expect(selected(w)).toBe('2')
    const next = action(w, 'next')
    next.focus()
    await userEvent.keyboard(' ')
    expect(selected(w)).toBe('3')
    expect(document.activeElement).toBe(next)
    expect(submit).not.toHaveBeenCalled()
  })

  it('blocks all controls when disabled and resumes from the same page', async () => {
    const w = await render({ disabled: true, value: 5, showFirstLast: true })
    expect(w.findAll('button').every(button => (button as HTMLButtonElement).disabled)).toBe(true)
    for (const button of w.findAll('button')) button.click()
    expect(w.updates).not.toHaveBeenCalled()
    await w.setProps({ disabled: false })
    await userEvent.click(action(w, 'next'))
    expect(selected(w)).toBe('6')
  })

  it.each(
    (['comfortable', 'compact'] as const).flatMap(density =>
      (['sm', 'md', 'lg'] as const).map(size => ({ density, size })),
    ),
  )('keeps page buttons square in $density density at size $size', async ({ density, size }) => {
    const w = await render({ size, value: 2, total: 12000, showFirstLast: true })
    const host = w.element
    host.dataset.density = density
    const holder = host.appendChild(document.createElement('div'))
    const button = await mount(
      <Button size={size} iconOnly aria-label="Reference">
        A
      </Button>,
      { container: holder },
    )
    const side = (button.container.firstElementChild as HTMLElement).offsetHeight
    for (const value of [2, 12, 123, 1000]) {
      await w.setProps({ value })
      for (const element of w.findAll('[data-hn-pagination-content] button')) {
        expect(element.offsetWidth).toBe(side)
        expect(element.offsetHeight).toBe(side)
        expect(element.scrollWidth).toBeLessThanOrEqual(element.clientWidth)
      }
      const current = w.find('[aria-current="page"]')!
      expect(current.textContent).toBe(String(value))
      expect(current.getAttribute('aria-label')).toBe(`第 ${value} 页`)
      expect(getComputedStyle(current).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    }
    const page = w.find('[aria-current="page"]')!
    expect(page.querySelector('[title]')).toBeNull()
  })

  it('contains long custom page content without widening or covering adjacent buttons', async () => {
    const screen = await mount(
      <Pagination
        total={50}
        defaultValue={2}
        renderPage={({ page }) => <span>{`Custom page ${page}`}</span>}
      />,
    )
    const buttons = [...screen.container.querySelectorAll<HTMLElement>('[data-type="page"]')]
    for (const element of buttons) {
      expect(element.offsetWidth).toBe(element.offsetHeight)
      expect(element.scrollWidth).toBeLessThanOrEqual(element.clientWidth)
    }
    const first = buttons[0]!.getBoundingClientRect()
    const second = buttons[1]!.getBoundingClientRect()
    expect(first.right).toBeLessThan(second.left)
  })

  it('inherits and dynamically changes DOM direction, with explicit direction taking precedence', async () => {
    const host = document.createElement('div')
    host.dir = 'rtl'
    document.body.append(host)
    const container = host.appendChild(document.createElement('div'))
    const page = await render({ total: 40, value: 3 }, container)
    const prev = action(page, 'prev')
    const next = action(page, 'next')
    await vi.waitFor(() =>
      expect(prev.querySelector('svg')?.classList.contains('rotate-180')).toBe(true),
    )
    expect(prev.getBoundingClientRect().left).toBeGreaterThan(next.getBoundingClientRect().left)
    host.dir = 'ltr'
    await vi.waitFor(() =>
      expect(prev.querySelector('svg')?.classList.contains('rotate-180')).toBe(false),
    )
    await page.setProps({ dir: 'rtl' })
    expect(prev.querySelector('svg')?.classList.contains('rotate-180')).toBe(true)
    expect(prev.getBoundingClientRect().left).toBeGreaterThan(next.getBoundingClientRect().left)
  })

  it('wraps within a narrow container without clipping controls', async () => {
    const w = await render({ value: 10, showFirstLast: true })
    const nav = w.element
    nav.style.width = '240px'
    const bounds = nav.getBoundingClientRect()
    expect(nav.scrollWidth).toBeLessThanOrEqual(nav.clientWidth)
    const buttons = w.findAll('button').map(button => button.getBoundingClientRect())
    expect(new Set(buttons.map(button => button.top)).size).toBeGreaterThan(1)
    expect(
      buttons.every(button => button.left >= bounds.left && button.right <= bounds.right),
    ).toBe(true)
  })

  it('inherits ConfigProvider direction and still selects next numerically in RTL', async () => {
    const screen = await mount(
      <ConfigProvider dir="rtl">
        <Pagination total={40} />
      </ConfigProvider>,
    )
    const root = screen.container.querySelector('[data-hn-pagination]')!
    expect(root.getAttribute('dir')).toBe('rtl')
    const next = root.querySelector<HTMLElement>('[data-hn-pagination-action="next"]')!
    expect(next.querySelector('svg')?.classList.contains('rotate-180')).toBe(true)
    await userEvent.click(next)
    expect(root.querySelector('[aria-current="page"]')!.textContent).toBe('2')
  })
})
