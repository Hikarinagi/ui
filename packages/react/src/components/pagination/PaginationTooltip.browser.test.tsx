import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { cleanup, render as mount, type RenderResult } from 'vitest-browser-react'
import { Pagination, type PaginationProps } from './Pagination'
import { TooltipProvider } from '../tooltip/TooltipProvider'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

let mounted: RenderResult[] = []
const vueTestUtilsTransitionStub = document.createElement('style')
vueTestUtilsTransitionStub.textContent =
  '[data-hn-pagination] button::before { content: ""; order: 1; }'

beforeEach(async () => {
  document.body.innerHTML = ''
  document.head.append(vueTestUtilsTransitionStub)
  const park = document.createElement('div')
  park.style.cssText = 'position:fixed;bottom:0;right:0;width:8px;height:8px'
  document.body.append(park)
  await userEvent.hover(park)
})

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
  await cleanup()
  vueTestUtilsTransitionStub.remove()
})

const tip = () => document.querySelector('[role="tooltip"]') as HTMLElement | null
const bubble = () =>
  document.querySelector('.hn-anim-pop.bg-neutral-solid[data-side]') as HTMLElement | null
const label = (element: HTMLElement) => element.querySelector('.truncate') as HTMLElement

async function render(
  props: Partial<PaginationProps> = {},
  options: { text?: string; delay?: number; provider?: boolean } = {},
) {
  const text = signal(options.text)
  const settings = signal(props)
  const updates = vi.fn()
  function Content() {
    const current = text.use()
    return (
      <div style={{ padding: 120 }}>
        <button id="outside" style={{ marginBottom: 40 }}>
          Outside
        </button>
        <Pagination
          total={2000000}
          defaultValue={100000}
          size="sm"
          {...settings.use()}
          onValueChange={updates}
          renderPage={({ page }) => <span>{current ?? String(page)}</span>}
        />
      </div>
    )
  }
  const w = await mount(
    options.provider === false ? (
      <Content />
    ) : (
      <TooltipProvider delayDuration={options.delay ?? 0}>
        <Content />
      </TooltipProvider>
    ),
  )
  mounted.push(w)
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  const root = w.container.querySelector<HTMLElement>('[data-hn-pagination]')!
  return {
    w,
    updates,
    pagination: {
      element: root,
      get: (selector: string) => root.querySelector<HTMLElement>(selector)!,
    },
    target: w.container.querySelector('[aria-current="page"]') as HTMLButtonElement,
    outside: w.container.querySelector('#outside') as HTMLElement,
    text,
    async setProps(value: Partial<PaginationProps>) {
      settings.value = { ...settings.value, ...value }
      await tick()
    },
  }
}

describe('Pagination truncated labels', () => {
  it('shows full text from the whole button only when its label overflows', async () => {
    const { w, target, outside } = await render()
    expect(w.container.querySelector('[title]')).toBeNull()
    const first = w.container.querySelector(
      '[data-type="page"][aria-label="第 1 页"]',
    ) as HTMLElement
    expect(label(first).scrollWidth).toBeLessThanOrEqual(label(first).clientWidth)
    await userEvent.hover(first)
    await new Promise(resolve => setTimeout(resolve, 120))
    expect(tip()).toBeNull()
    expect(label(target).scrollWidth).toBeGreaterThan(label(target).clientWidth)
    await userEvent.hover(target, { position: { x: 2, y: 2 } })
    await vi.waitFor(() => expect(tip()?.textContent).toBe('100000'))
    expect(target.getAttribute('aria-describedby')).toBe(tip()!.id)
    expect(target.getAttribute('aria-current')).toBe('page')
    expect(target.getAttribute('aria-label')).toBe('第 100000 页')
    expect(target.offsetWidth).toBe(target.offsetHeight)
    expect(bubble()?.classList.contains('hn-anim-pop')).toBe(true)
    await userEvent.hover(outside)
    await userEvent.hover(outside, { position: { x: 1, y: 1 } })
    await vi.waitFor(() => expect(bubble()).toBeNull())
    expect(target.hasAttribute('aria-describedby')).toBe(false)
  })

  it('supports keyboard focus and Escape while preserving page selection', async () => {
    const { pagination, target, updates } = await render({ showEdges: false })
    const prev = pagination.get('[data-hn-pagination-action="prev"]')
    await userEvent.keyboard('{ArrowDown}')
    prev.focus()
    await userEvent.tab()
    const before = pagination.get('[aria-label="第 99999 页"]')
    expect(document.activeElement).toBe(before)
    await vi.waitFor(() => expect(tip()?.textContent).toBe('99999'))
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(bubble()).toBeNull())
    expect(document.activeElement).toBe(before)
    await userEvent.tab()
    expect(document.activeElement).toBe(target)
    await vi.waitFor(() => expect(tip()?.textContent).toBe('100000'))
    await userEvent.tab()
    await vi.waitFor(() => expect(tip()?.textContent).toBe('100001'))
    await userEvent.keyboard('{Enter}')
    expect(updates.mock.calls.at(-1)).toEqual([100001])
    await vi.waitFor(() => expect(bubble()).toBeNull())
  })

  it.each(['inherit', 'sans-serif', 'monospace'])(
    'rechecks dimensions without replacing the button with %s text',
    async fontFamily => {
      const { pagination, target, outside, setProps } = await render({
        defaultValue: 100,
        style: { fontFamily },
      })
      await userEvent.hover(target)
      await vi.waitFor(() => expect(tip()?.textContent).toBe('100'))
      target.focus()
      await setProps({ size: 'lg' })
      expect(label(target).scrollWidth).toBeLessThanOrEqual(label(target).clientWidth)
      await vi.waitFor(() => expect(bubble()).toBeNull())
      expect(pagination.get('[aria-current="page"]')).toBe(target)
      expect(document.activeElement).toBe(target)
      await userEvent.hover(outside)
      await setProps({ size: 'md' })
      await userEvent.hover(target)
      await new Promise(resolve => setTimeout(resolve, 120))
      const overflowing = label(target).scrollWidth > label(target).clientWidth
      expect(tip()?.textContent ?? null).toBe(overflowing ? '100' : null)
      await userEvent.hover(outside)
      pagination.element.dataset.density = 'compact'
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      expect(label(target).scrollWidth).toBeGreaterThan(label(target).clientWidth)
      await userEvent.hover(target)
      await vi.waitFor(() => expect(tip()?.textContent).toBe('100'))
      expect(pagination.get('[aria-current="page"]')).toBe(target)
    },
  )

  it('tracks custom slot text, including updates that leave the button size unchanged', async () => {
    const { target, text, outside } = await render({ total: 50, defaultValue: 2 }, { text: 'II' })
    await userEvent.hover(target)
    await new Promise(resolve => setTimeout(resolve, 120))
    expect(tip()).toBeNull()
    await userEvent.hover(outside)
    text.value = 'Page number two'
    await tick()
    await userEvent.hover(target)
    await vi.waitFor(() => expect(tip()?.textContent).toBe('Page number two'))
    const width = target.offsetWidth
    text.value = 'Updated page label'
    await vi.waitFor(() => expect(tip()?.textContent).toBe('Updated page label'))
    expect(target.offsetWidth).toBe(width)
    text.value = 'II'
    await vi.waitFor(() => expect(bubble()).toBeNull())
    expect(target.getAttribute('aria-label')).toBe('第 2 页')
  })

  it.each(['disabled', 'pending'])(
    'dismisses the tooltip while %s and allows it again after resuming',
    async prop => {
      const { target, outside, setProps } = await render()
      await userEvent.hover(target)
      await vi.waitFor(() => expect(tip()).toBeTruthy())
      await setProps(prop === 'disabled' ? { disabled: true } : { pending: true })
      await vi.waitFor(() => expect(bubble()).toBeNull())
      expect(target.hasAttribute('aria-describedby')).toBe(false)
      await userEvent.hover(outside)
      await setProps(prop === 'disabled' ? { disabled: false } : { pending: false })
      await userEvent.hover(target)
      await vi.waitFor(() => expect(tip()?.textContent).toBe('100000'))
    },
  )

  it('cancels delayed hints when blocked or unmounted', async () => {
    const { w, target, outside, setProps } = await render({}, { delay: 250 })
    await userEvent.hover(target)
    expect(tip()).toBeNull()
    await setProps({ pending: true })
    await new Promise(resolve => setTimeout(resolve, 350))
    expect(tip()).toBeNull()
    await userEvent.hover(outside)
    await setProps({ pending: false })
    await userEvent.hover(target)
    await w.unmount()
    mounted = mounted.filter(wrapper => wrapper !== w)
    await new Promise(resolve => setTimeout(resolve, 350))
    expect(tip()).toBeNull()
    expect(target.hasAttribute('aria-describedby')).toBe(false)
  })

  it('works independently without requiring a TooltipProvider or restoring native titles', async () => {
    const { w, pagination, target, updates } = await render({}, { provider: false })
    await userEvent.hover(target)
    expect(tip()).toBeNull()
    expect(w.container.querySelector('[title]')).toBeNull()
    await userEvent.click(pagination.get('[aria-label="第 100001 页"]'))
    expect(updates.mock.calls.at(-1)).toEqual([100001])
  })
})
