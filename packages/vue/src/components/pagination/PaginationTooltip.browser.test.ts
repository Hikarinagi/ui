import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import Pagination from './Pagination.vue'
import TooltipProvider from '../tooltip/TooltipProvider.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(async () => {
  document.body.innerHTML = ''
  const park = document.createElement('div')
  park.style.cssText = 'position:fixed;bottom:0;right:0;width:8px;height:8px'
  document.body.append(park)
  await userEvent.hover(park)
})

afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted = []
})

const tip = () => document.querySelector('[role="tooltip"]') as HTMLElement | null
const bubble = () =>
  document.querySelector('.hn-anim-pop.bg-neutral-solid[data-side]') as HTMLElement | null
const label = (element: HTMLElement) => element.querySelector('.truncate') as HTMLElement

async function render(
  props: Record<string, unknown> = {},
  options: { text?: string; delay?: number; provider?: boolean } = {},
) {
  const text = ref(options.text)
  const settings = ref(props)
  const w = mount(
    defineComponent({
      setup() {
        const content = () =>
          h('div', { style: 'padding:120px' }, [
            h('button', { id: 'outside', style: 'margin-bottom:40px' }, 'Outside'),
            h(
              Pagination,
              {
                total: 2000000,
                modelValue: 100000,
                size: 'sm',
                ...settings.value,
              },
              { page: ({ page }: { page: number }) => h('span', text.value ?? String(page)) },
            ),
          ])
        return () =>
          options.provider === false
            ? content()
            : h(TooltipProvider, { delayDuration: options.delay ?? 0 }, content)
      },
    }),
    { attachTo: document.body },
  )
  mounted.push(w)
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  return {
    w,
    pagination: w.getComponent(Pagination),
    target: w.get('[aria-current="page"]').element as HTMLButtonElement,
    outside: w.get('#outside').element as HTMLElement,
    text,
    async setProps(value: Record<string, unknown>) {
      settings.value = { ...settings.value, ...value }
      await nextTick()
    },
  }
}

describe('Pagination truncated labels', () => {
  it('shows full text from the whole button only when its label overflows', async () => {
    const { w, target, outside } = await render()
    expect(w.find('[title]').exists()).toBe(false)
    const first = w.get('[data-type="page"][aria-label="第 1 页"]').element as HTMLElement
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
    const { pagination, target } = await render({ showEdges: false })
    const prev = pagination.get('[data-hn-pagination-action="prev"]').element as HTMLElement
    await userEvent.keyboard('{ArrowDown}')
    prev.focus()
    await userEvent.tab()
    const before = pagination.get('[aria-label="第 99999 页"]').element as HTMLElement
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
    expect(pagination.emitted('update:modelValue')?.at(-1)).toEqual([100001])
    await vi.waitFor(() => expect(bubble()).toBeNull())
  })

  it('rechecks dimensions and dismisses an open hint without replacing the button', async () => {
    const { pagination, target, outside, setProps } = await render({ modelValue: 100 })
    await userEvent.hover(target)
    await vi.waitFor(() => expect(tip()?.textContent).toBe('100'))
    target.focus()
    await setProps({ size: 'lg' })
    expect(label(target).scrollWidth).toBeLessThanOrEqual(label(target).clientWidth)
    await vi.waitFor(() => expect(bubble()).toBeNull())
    expect(pagination.get('[aria-current="page"]').element).toBe(target)
    expect(document.activeElement).toBe(target)
    await userEvent.hover(outside)
    await setProps({ size: 'md' })
    await userEvent.hover(target)
    await new Promise(resolve => setTimeout(resolve, 120))
    expect(tip()).toBeNull()
    await userEvent.hover(outside)
    ;(pagination.element as HTMLElement).dataset.density = 'compact'
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    expect(label(target).scrollWidth).toBeGreaterThan(label(target).clientWidth)
    await userEvent.hover(target)
    await vi.waitFor(() => expect(tip()?.textContent).toBe('100'))
    expect(pagination.get('[aria-current="page"]').element).toBe(target)
  })

  it('tracks custom slot text, including updates that leave the button size unchanged', async () => {
    const { target, text, outside } = await render({ total: 50, modelValue: 2 }, { text: 'II' })
    await userEvent.hover(target)
    await new Promise(resolve => setTimeout(resolve, 120))
    expect(tip()).toBeNull()
    await userEvent.hover(outside)
    text.value = 'Page number two'
    await nextTick()
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
      await setProps({ [prop]: true })
      await vi.waitFor(() => expect(bubble()).toBeNull())
      expect(target.hasAttribute('aria-describedby')).toBe(false)
      await userEvent.hover(outside)
      await setProps({ [prop]: false })
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
    w.unmount()
    mounted = mounted.filter(wrapper => wrapper !== w)
    await new Promise(resolve => setTimeout(resolve, 350))
    expect(tip()).toBeNull()
    expect(target.hasAttribute('aria-describedby')).toBe(false)
  })

  it('works independently without requiring a TooltipProvider or restoring native titles', async () => {
    const { w, pagination, target } = await render({}, { provider: false })
    await userEvent.hover(target)
    expect(tip()).toBeNull()
    expect(w.find('[title]').exists()).toBe(false)
    await userEvent.click(pagination.get('[aria-label="第 100001 页"]').element)
    expect(pagination.emitted('update:modelValue')?.at(-1)).toEqual([100001])
  })
})
