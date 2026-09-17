import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, ref, type VNode } from 'vue'
import { userEvent } from 'vitest/browser'
import VirtualList from './VirtualList.vue'
import type { VirtualListExpose } from './types'
import { expectNoA11yViolations } from '../../../test/axe'
import '../../../test/browser.css'

const wrappers: VueWrapper[] = []
const items = Array.from({ length: 10000 }, (_, id) => ({ id, label: `Item ${id}` }))
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

function create(
  props: Record<string, unknown> = {},
  slot?: (props: { item: (typeof items)[number]; index: number }) => VNode,
) {
  const wrapper = mount(VirtualList<(typeof items)[number]>, {
    attachTo: document.body,
    props: {
      items,
      getKey: item => item.id,
      estimateSize: 40,
      dynamic: false,
      height: 200,
      label: 'Items',
      style: { width: '400px' },
      ...props,
    },
    slots: { default: slot ?? (({ item }) => h('span', item.label)) },
  })
  wrappers.push(wrapper)
  return wrapper
}

function api(wrapper: VueWrapper) {
  return wrapper.vm as unknown as VirtualListExpose
}

async function ready(wrapper: VueWrapper) {
  await vi.waitFor(() => expect(api(wrapper).viewport).toBeInstanceOf(HTMLElement))
  return api(wrapper).viewport!
}

function row(wrapper: VueWrapper, index: number) {
  return wrapper.find<HTMLElement>(`li[data-index="${index}"]`)
}

describe('VirtualList browser behavior', () => {
  it('keeps a ten-thousand-item list bounded and scrolls to an exact index', async () => {
    const wrapper = create()
    const viewport = await ready(wrapper)
    expect(wrapper.findAll('li').length).toBeLessThan(25)
    expect(viewport.scrollHeight).toBe(400000)
    api(wrapper).scrollToIndex(5000, { align: 'start' })
    await vi.waitFor(() => expect(row(wrapper, 5000).exists()).toBe(true))
    await vi.waitFor(() => expect(Math.abs(viewport.scrollTop - 200000)).toBeLessThan(1))
    expect(wrapper.findAll('li').length).toBeLessThan(25)
    expect(row(wrapper, 5000).attributes('aria-posinset')).toBe('5001')
    expect(wrapper.emitted('rangeChange')?.at(-1)?.[0]).toMatchObject({ startIndex: 5000 })
    api(wrapper).scrollToOffset(0)
    await vi.waitFor(() => expect(viewport.scrollTop).toBe(0))
    await expectNoA11yViolations(wrapper.element)
  })

  it('queues scrolling until the ScrollArea viewport is ready', async () => {
    const wrapper = create()
    api(wrapper).scrollToIndex(20, { align: 'center' })
    const viewport = await ready(wrapper)
    await vi.waitFor(() => expect(viewport.scrollTop).toBe(720))
  })

  it('measures dynamic heights, gaps, and asynchronous expansion without overlapping rows', async () => {
    const expanded = ref(false)
    const wrapper = create(
      { dynamic: true, gap: 8, paddingStart: 12, paddingEnd: 16 },
      ({ index }) =>
        h(
          'div',
          { style: { height: `${index === 0 && expanded.value ? 150 : 50}px` } },
          `Row ${index}`,
        ),
    )
    const viewport = await ready(wrapper)
    await vi.waitFor(() =>
      expect(
        row(wrapper, 1).element.getBoundingClientRect().top -
          row(wrapper, 0).element.getBoundingClientRect().bottom,
      ).toBe(8),
    )
    expect(
      row(wrapper, 0).element.getBoundingClientRect().top - viewport.getBoundingClientRect().top,
    ).toBe(12)
    expanded.value = true
    await vi.waitFor(() => expect(row(wrapper, 0).element.getBoundingClientRect().height).toBe(150))
    await vi.waitFor(() =>
      expect(
        row(wrapper, 1).element.getBoundingClientRect().top -
          row(wrapper, 0).element.getBoundingClientRect().bottom,
      ).toBe(8),
    )
    api(wrapper).scrollToIndex(200, { align: 'start' })
    await vi.waitFor(() => expect(row(wrapper, 200).exists()).toBe(true))
    await vi.waitFor(() =>
      expect(
        Math.abs(
          row(wrapper, 200).element.getBoundingClientRect().top -
            viewport.getBoundingClientRect().top,
        ),
      ).toBeLessThan(2),
    )
  })

  it('remeasures wrapped content when the viewport becomes narrower', async () => {
    const wrapper = create({ dynamic: true }, ({ item }) =>
      h(
        'p',
        { style: { margin: '0', lineHeight: '24px' } },
        `${item.label} ${'Text wraps across lines. '.repeat(8)}`,
      ),
    )
    await ready(wrapper)
    const before = row(wrapper, 0).element.getBoundingClientRect().height
    await wrapper.setProps({ style: { width: '220px' } })
    await vi.waitFor(() =>
      expect(row(wrapper, 0).element.getBoundingClientRect().height).toBeGreaterThan(before),
    )
    await vi.waitFor(() =>
      expect(
        Math.abs(
          row(wrapper, 1).element.getBoundingClientRect().top -
            row(wrapper, 0).element.getBoundingClientRect().bottom,
        ),
      ).toBeLessThan(1),
    )
  })

  it('retains a focused input outside the window and releases it after focus leaves', async () => {
    const wrapper = create({}, ({ item }) => h('input', { 'aria-label': item.label }))
    const viewport = await ready(wrapper)
    const input = row(wrapper, 0).find('input').element
    input.focus()
    input.value = 'Uncommitted text'
    viewport.scrollTop = 20000
    viewport.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(row(wrapper, 500).exists()).toBe(true))
    expect(document.activeElement).toBe(input)
    expect(input.isConnected).toBe(true)
    expect(wrapper.findAll('li').length).toBeLessThan(25)
    viewport.focus({ preventScroll: true })
    await vi.waitFor(() => expect(input.isConnected).toBe(false))
  })

  it('preserves keyed DOM and edited input state when items are reordered', async () => {
    const wrapper = create({ items: items.slice(0, 4) }, ({ item }) =>
      h('input', { 'aria-label': item.label }),
    )
    await ready(wrapper)
    const input = row(wrapper, 0).find('input').element
    input.value = 'Keep this'
    await wrapper.setProps({ items: [items[1]!, items[0]!, items[2]!, items[3]!] })
    expect(row(wrapper, 1).find('input').element).toBe(input)
    expect(input.value).toBe('Keep this')
  })

  it.each(['ltr', 'rtl'] as const)('positions and scrolls horizontal content in %s', async dir => {
    const wrapper = create({
      orientation: 'horizontal',
      dir,
      estimateSize: 100,
      gap: 8,
      height: 120,
    })
    const viewport = await ready(wrapper)
    const first = row(wrapper, 0).element.getBoundingClientRect()
    const second = row(wrapper, 1).element.getBoundingClientRect()
    expect(dir === 'rtl' ? first.left - second.right : second.left - first.right).toBe(8)
    api(wrapper).scrollToIndex(50, { align: 'start' })
    await vi.waitFor(() => expect(row(wrapper, 50).exists()).toBe(true))
    await vi.waitFor(() => expect(Math.abs(viewport.scrollLeft)).toBe(5400))
    const target = row(wrapper, 50).element.getBoundingClientRect()
    const bounds = viewport.getBoundingClientRect()
    expect(
      Math.abs(dir === 'rtl' ? target.right - bounds.right : target.left - bounds.left),
    ).toBeLessThan(1)
  })

  it('supports heterogeneous fixed sizes and runtime size changes', async () => {
    const wrapper = create({
      estimateSize: (_item: unknown, index: number) => (index % 2 ? 60 : 40),
    })
    const viewport = await ready(wrapper)
    api(wrapper).scrollToIndex(10, { align: 'start' })
    await vi.waitFor(() => expect(viewport.scrollTop).toBe(500))
    await wrapper.setProps({ estimateSize: 80 })
    api(wrapper).scrollToIndex(10, { align: 'start' })
    await vi.waitFor(() => expect(viewport.scrollTop).toBe(800))
    await vi.waitFor(() => expect(row(wrapper, 10).element.getBoundingClientRect().height).toBe(80))
  })

  it('keeps existing items during loading and recovers after clearing and replacing data', async () => {
    const wrapper = create({ items: items.slice(0, 100) })
    const viewport = await ready(wrapper)
    api(wrapper).scrollToIndex(99)
    await vi.waitFor(() => expect(row(wrapper, 99).exists()).toBe(true))
    await wrapper.setProps({ loading: true })
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.findAll('li').length).toBeGreaterThan(0)
    await wrapper.setProps({ items: [], loading: false, emptyText: 'Nothing here' })
    await vi.waitFor(() => expect(viewport.scrollTop).toBe(0))
    expect(wrapper.text()).toContain('Nothing here')
    expect(wrapper.findAll('li')).toHaveLength(0)
    await wrapper.setProps({ items: items.slice(0, 3) })
    await vi.waitFor(() => expect(wrapper.findAll('li')).toHaveLength(3))
    expect(wrapper.text()).not.toContain('Nothing here')
  })

  it('allows native keyboard scrolling from the named viewport', async () => {
    const wrapper = create()
    const viewport = await ready(wrapper)
    viewport.focus()
    await userEvent.keyboard('{PageDown}')
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
    expect(viewport.getAttribute('aria-label')).toBe('Items')
    await userEvent.keyboard('{Control>}{End}{/Control}')
    await nextTick()
  })

  it('starts at the requested offset and supports smooth jumps to the final item', async () => {
    const wrapper = create({ initialOffset: 400, items: items.slice(0, 200) })
    const viewport = await ready(wrapper)
    await vi.waitFor(() => expect(viewport.scrollTop).toBe(400))
    api(wrapper).scrollToIndex(199, { align: 'end', behavior: 'smooth' })
    await vi.waitFor(() => expect(viewport.scrollTop).toBe(7800), { timeout: 2500 })
    await vi.waitFor(() => expect(row(wrapper, 199).exists()).toBe(true))
  })

  it('recovers dynamic measurement when a hidden list becomes visible', async () => {
    const wrapper = create(
      { dynamic: true, style: { width: '400px', display: 'none' } },
      ({ item }) => h('div', { style: { height: '70px' } }, item.label),
    )
    const viewport = await ready(wrapper)
    await wrapper.setProps({ style: { width: '400px' } })
    await vi.waitFor(() => expect(row(wrapper, 0).exists()).toBe(true))
    await vi.waitFor(() =>
      expect(
        row(wrapper, 1).element.getBoundingClientRect().top -
          row(wrapper, 0).element.getBoundingClientRect().top,
      ).toBe(70),
    )
    expect(viewport.scrollTop).toBe(0)
    expect(wrapper.findAll('li').length).toBeLessThan(25)
  })

  it('inherits horizontal RTL without an explicit direction prop', async () => {
    const container = document.createElement('div')
    container.dir = 'rtl'
    document.body.append(container)
    const wrapper = mount(VirtualList<(typeof items)[number]>, {
      attachTo: container,
      props: {
        items,
        getKey: item => item.id,
        orientation: 'horizontal',
        dynamic: false,
        estimateSize: 100,
        height: 100,
        style: { width: '400px' },
      },
      slots: { default: ({ item }) => item.label },
    })
    wrappers.push(wrapper)
    const viewport = await ready(wrapper)
    api(wrapper).scrollToIndex(40, { align: 'start' })
    await vi.waitFor(() => expect(viewport.scrollLeft).toBe(-4000))
    await vi.waitFor(() => expect(row(wrapper, 40).exists()).toBe(true))
    expect(
      Math.abs(
        row(wrapper, 40).element.getBoundingClientRect().right -
          viewport.getBoundingClientRect().right,
      ),
    ).toBeLessThan(1)
  })
})
