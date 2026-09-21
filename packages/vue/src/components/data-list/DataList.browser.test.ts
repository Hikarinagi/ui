import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createSSRApp, h, nextTick, type App } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { userEvent } from 'vitest/browser'
import DataList from './DataList.vue'
import { zhCN } from '../../locale'
import type { DataListExpose, DataListItemSlot } from './types'
import { expectNoA11yViolations } from '../../../test/axe'
import '../../../test/browser.css'

const items = Array.from({ length: 23 }, (_, id) => ({ id, label: `Item ${id}` }))
type Item = (typeof items)[number]
const wrappers: VueWrapper[] = []
const apps: App[] = []
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  apps.splice(0).forEach(app => app.unmount())
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

function create(props: Record<string, unknown> = {}) {
  const wrapper = mount(DataList<Item>, {
    attachTo: document.body,
    props: { items, itemKey: 'id', label: 'Items', style: { width: '600px' }, ...props },
    slots: {
      default: ({ item, index }: DataListItemSlot<Item>) =>
        h('button', { type: 'button', 'data-row': item.id }, `${item.label} (${index})`),
    },
  })
  wrappers.push(wrapper)
  return wrapper
}

function surroundWithScroller(wrapper: VueWrapper) {
  const outer = document.createElement('div')
  outer.style.cssText = 'height: 200px; overflow: auto; overflow-anchor: none'
  const spacer = document.createElement('div')
  spacer.style.height = '600px'
  outer.append(spacer, wrapper.element, spacer.cloneNode())
  document.body.append(outer)
  outer.scrollTop = 100
  return outer
}

describe('DataList browser behavior', () => {
  it('pages local items once and announces the current page', async () => {
    const wrapper = create({ pagination: true, pageSize: 5 })
    expect(wrapper.findAll('[data-row]')).toHaveLength(5)
    const next = wrapper
      .findAll('button')
      .find(button => button.attributes('aria-label') === zhCN.pagination.next)!
    await userEvent.click(next.element)
    await vi.waitFor(() => expect(wrapper.find('[data-row="5"]').exists()).toBe(true))
    expect(wrapper.find('[data-row="0"]').exists()).toBe(false)
    expect(wrapper.emitted('pageChange')).toEqual([[{ page: 2, pageSize: 5 }]])
    await expectNoA11yViolations(wrapper.element)
  })

  it('keeps keyed nodes and focus when switching layout, and wraps grids in LTR and RTL', async () => {
    const wrapper = create({ items: items.slice(0, 4), gridMin: '12rem', gridGap: 'sm' })
    const button = wrapper.get<HTMLButtonElement>('[data-row="0"]').element
    button.focus()
    await wrapper.setProps({ layout: 'grid' })
    expect(wrapper.get('[data-row="0"]').element).toBe(button)
    expect(document.activeElement).toBe(button)
    const rows = () => wrapper.findAll<HTMLElement>('li')
    expect(
      Math.abs(
        rows()[0]!.element.getBoundingClientRect().top -
          rows()[1]!.element.getBoundingClientRect().top,
      ),
    ).toBeLessThan(1)
    for (const dir of ['ltr', 'rtl']) {
      await wrapper.setProps({ dir, style: { width: '180px' } })
      const first = rows()[0]!.element.getBoundingClientRect()
      const second = rows()[1]!.element.getBoundingClientRect()
      expect(second.top).toBeGreaterThanOrEqual(first.bottom)
      expect(wrapper.element.scrollWidth).toBeLessThanOrEqual(180)
    }
  })

  it('allows itemClass to override vertical padding without specificity workarounds', async () => {
    const wrapper = create({ itemClass: 'py-1' })
    expect(getComputedStyle(wrapper.get('li').element).paddingBlockStart).toBe('4px')
    await wrapper.setProps({
      itemClass: (_item: Item, index: number) => (index === 0 ? 'py-8' : 'py-1'),
    })
    expect(getComputedStyle(wrapper.get('li').element).paddingBlockStart).toBe('32px')
  })

  it('preserves existing rows during loading while blocking their interactions and paging', async () => {
    const wrapper = create({ pagination: true, manual: true, hasNextPage: true })
    const row = wrapper.get('[data-row="0"]').element
    await wrapper.setProps({ loading: true })
    expect(wrapper.get('[data-row="0"]').element).toBe(row)
    expect(row.closest('[inert]')).not.toBeNull()
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.get('nav button:last-child').attributes('disabled')).toBeDefined()
    await wrapper.setProps({ loading: false })
    expect(row.closest('[inert]')).toBeNull()
    await userEvent.click(wrapper.get('nav button:last-child').element)
    expect(wrapper.emitted('pageChange')).toEqual([[{ page: 2, pageSize: 10 }]])
    expect(wrapper.findAll('[data-row]')).toHaveLength(23)
    await wrapper.setProps({ hasNextPage: false })
    expect(wrapper.get('nav button:last-child').attributes('disabled')).toBeDefined()
  })

  it.each([false, true, { initialColumns: 2, estimateSize: 64 }])(
    'hydrates readable list content without replacing server nodes (virtual=%s)',
    async virtualize => {
      const component = {
        render: () =>
          h(
            DataList<Item>,
            {
              items,
              itemKey: 'id',
              virtualize,
              height: 200,
              ...(typeof virtualize === 'object'
                ? { layout: 'grid' as const, gridMin: '160px', style: { width: '360px' } }
                : {}),
            },
            {
              default: ({ item }: DataListItemSlot<Item>) =>
                h('span', { 'data-row': item.id }, item.label),
            },
          ),
      }
      const host = document.createElement('div')
      host.innerHTML = await renderToString(createSSRApp(component))
      document.body.append(host)
      const first = host.querySelector('[data-row="0"]')
      expect(first).not.toBeNull()
      const warn = vi.spyOn(console, 'warn')
      const error = vi.spyOn(console, 'error')
      const app = createSSRApp(component)
      apps.push(app)
      app.mount(host)
      await nextTick()
      expect(host.querySelector('[data-row="0"]')).toBe(first)
      expect(warn.mock.calls.flat().join(' ')).not.toMatch(/hydration/i)
      expect(error.mock.calls.flat().join(' ')).not.toMatch(/hydration/i)
    },
  )

  it('renders a bounded virtual window and reveals later items when scrolled', async () => {
    const many = Array.from({ length: 10000 }, (_, id) => ({ id, label: `Item ${id}` }))
    const wrapper = create({ items: many, virtualize: { estimateSize: 64 }, height: 200 })
    await vi.waitFor(() =>
      expect(wrapper.find('[data-overlayscrollbars-viewport]').exists()).toBe(true),
    )
    const viewport = wrapper.get<HTMLElement>('[data-overlayscrollbars-viewport]').element
    expect(wrapper.findAll('li').length).toBeLessThan(30)
    viewport.scrollTop = 5000
    await vi.waitFor(() =>
      expect(Number(wrapper.get('[data-row]').attributes('data-row'))).toBeGreaterThan(30),
    )
    expect(wrapper.findAll('li').length).toBeLessThan(30)
    await expectNoA11yViolations(wrapper.element)
  })

  it('starts each virtual page at the beginning after scrolling the previous page', async () => {
    const many = Array.from({ length: 300 }, (_, id) => ({ id, label: `Item ${id}` }))
    const wrapper = create({
      items: many,
      virtualize: true,
      pagination: true,
      pageSize: 100,
      height: 200,
    })
    await vi.waitFor(() =>
      expect(wrapper.find('[data-overlayscrollbars-viewport]').exists()).toBe(true),
    )
    wrapper.get<HTMLElement>('[data-overlayscrollbars-viewport]').element.scrollTop = 2000
    await vi.waitFor(() =>
      expect(Number(wrapper.get('[data-row]').attributes('data-row'))).toBeGreaterThan(10),
    )
    await wrapper.setProps({ page: 2 })
    await vi.waitFor(() => expect(wrapper.find('[data-row="100"]').exists()).toBe(true))
    await vi.waitFor(() =>
      expect(wrapper.get<HTMLElement>('[data-overlayscrollbars-viewport]').element.scrollTop).toBe(
        0,
      ),
    )
  })

  it.each([
    { height: undefined, virtualize: false },
    { height: 200, virtualize: false },
    { height: 200, virtualize: true },
  ])(
    'keeps the containing page stationary when initial remote results arrive (%j)',
    async options => {
      const wrapper = create({
        ...options,
        items: [],
        loading: true,
        pagination: true,
        manual: true,
        total: 100,
      })
      const outer = surroundWithScroller(wrapper)
      const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')
      await wrapper.setProps({ items: items.slice(0, 10), loading: false })
      await nextTick()
      expect(scrollIntoView).not.toHaveBeenCalled()
      expect(outer.scrollTop).toBe(100)
    },
  )

  it.each([
    { height: undefined, virtualize: false },
    { height: 200, virtualize: false },
    { height: 200, virtualize: true },
  ])('resets only its own scroll viewport on page changes (%j)', async options => {
    const wrapper = create({ ...options, pagination: true, pageSize: 10 })
    const outer = surroundWithScroller(wrapper)
    const api = wrapper.vm as unknown as DataListExpose
    if (options.height) {
      await vi.waitFor(() => expect(api.viewport?.clientHeight).toBe(200))
      api.viewport!.scrollTop = 200
      await vi.waitFor(() => expect(api.viewport!.scrollTop).toBe(200))
    }
    await wrapper.setProps({ page: 2 })
    if (options.height) await vi.waitFor(() => expect(api.viewport!.scrollTop).toBe(0))
    expect(outer.scrollTop).toBe(100)
  })

  it('keeps explicit item alignment inside a bounded nonvirtual viewport', async () => {
    const wrapper = create({ height: 200, itemClass: 'h-16 p-0', divided: false })
    const outer = surroundWithScroller(wrapper)
    const api = wrapper.vm as unknown as DataListExpose
    await vi.waitFor(() => expect(api.viewport?.clientHeight).toBe(200))
    const row = () => wrapper.get<HTMLElement>('[data-index="10"]').element.getBoundingClientRect()
    api.scrollToIndex(10, { align: 'center' })
    await vi.waitFor(() =>
      expect(
        Math.abs(row().top + row().height / 2 - api.viewport!.getBoundingClientRect().top - 100),
      ).toBeLessThan(1),
    )
    expect(outer.scrollTop).toBe(100)
    const previous = api.viewport!.scrollTop
    api.scrollToIndex(10)
    expect(api.viewport!.scrollTop).toBe(previous)
    api.scrollToIndex(10, { align: 'end' })
    await vi.waitFor(() =>
      expect(Math.abs(row().bottom - api.viewport!.getBoundingClientRect().bottom)).toBeLessThan(1),
    )
    expect(outer.scrollTop).toBe(100)
  })

  it('formats only rendered virtual items and retains complete long titles', async () => {
    const title = vi.fn((item: Item) => `${item.label} ${'long title '.repeat(30)}`)
    const wrapper = mount(DataList<Item>, {
      attachTo: document.body,
      props: {
        items: Array.from({ length: 10000 }, (_, id) => ({ id, label: `Item ${id}` })),
        itemKey: 'id',
        itemTitle: title,
        height: 200,
        virtualize: { estimateSize: 120, overscan: 1 },
        style: { width: '240px' },
      },
    })
    wrappers.push(wrapper)
    await vi.waitFor(() => expect(wrapper.find('[data-hn-data-list-item]').exists()).toBe(true))
    expect(new Set(title.mock.calls.map(([item]) => item.id)).size).toBeLessThan(20)
    const text = wrapper.get('[data-hn-data-list-item] .font-medium').element as HTMLElement
    expect(text.clientHeight).toBe(text.scrollHeight)
    expect(getComputedStyle(text).webkitLineClamp).toBe('none')
  })

  it('matches title-only skeletons to their content and aligns the footer with paging', async () => {
    const wrapper = mount(DataList<Item>, {
      attachTo: document.body,
      props: {
        items: items.slice(0, 3),
        itemKey: 'id',
        itemTitle: 'label',
        placeholderCount: 3,
        pagination: true,
        pageSize: 2,
        style: { width: '600px' },
      },
      slots: { footer: () => h('span', { 'data-summary': '' }, '3 items') },
    })
    wrappers.push(wrapper)
    const itemHeight = wrapper
      .get('[data-hn-data-list-item]')
      .element.getBoundingClientRect().height
    const summary = wrapper.get('[data-summary]').element.getBoundingClientRect()
    const pagination = wrapper.get('nav').element.getBoundingClientRect()
    expect(
      Math.abs(summary.top + summary.height / 2 - pagination.top - pagination.height / 2),
    ).toBeLessThan(1)
    await wrapper.setProps({ items: [], loading: true })
    expect(wrapper.findAll('.hn-skeleton')).toHaveLength(3)
    expect(
      wrapper.get('[data-hn-data-list-content] li').element.getBoundingClientRect().height,
    ).toBe(itemHeight)
    await wrapper.setProps({ items: items.slice(0, 1), loading: false })
    expect(wrapper.find('nav').exists()).toBe(false)
    expect(wrapper.get('[data-summary]').text()).toBe('3 items')
  })

  it('resolves percentage virtual heights and preserves them for empty loading states', async () => {
    const wrapper = create({
      virtualize: true,
      height: '100%',
      style: { height: '240px', width: '400px' },
    })
    await vi.waitFor(() =>
      expect(wrapper.find('[data-overlayscrollbars-viewport]').exists()).toBe(true),
    )
    expect(
      wrapper.get('[data-overlayscrollbars-viewport]').element.getBoundingClientRect().height,
    ).toBe(240)
    await wrapper.setProps({ items: [], loading: true })
    expect(
      wrapper.get('[data-overlayscrollbars-viewport]').element.getBoundingClientRect().height,
    ).toBe(240)
    expect(wrapper.element.getBoundingClientRect().height).toBe(240)
    await wrapper.setProps({ style: { height: '80px', width: '400px' } })
    expect(
      wrapper.get('[data-overlayscrollbars-viewport]').element.getBoundingClientRect().height,
    ).toBe(80)
  })
  it('keeps virtual grids bounded, measured, padded and anchored across column changes', async () => {
    const many = Array.from({ length: 1000 }, (_, id) => ({ id, label: `Item ${id}` }))
    const wrapper = create({
      items: many,
      layout: 'grid',
      gridMin: '180px',
      gridGap: 'sm',
      contentClass: 'p-4',
      itemClass: (_item: Item, index: number) => (index % 3 === 0 ? 'h-24 p-0' : 'h-20 p-0'),
      virtualize: { estimateSize: 96, overscan: 1, initialColumns: 3 },
      height: 240,
    })
    const api = wrapper.vm as unknown as DataListExpose
    await vi.waitFor(() => expect(api.viewport?.clientHeight).toBe(240))
    const list = wrapper.get<HTMLElement>('[data-hn-data-list-content]').element
    const row = (id: number) =>
      wrapper.get<HTMLElement>(`[data-index="${id}"]`).element.getBoundingClientRect()
    await vi.waitFor(() => expect(Math.abs(row(3).top - row(0).bottom - 8)).toBeLessThan(1))
    expect(getComputedStyle(list).paddingBlockStart).toBe('16px')
    expect(getComputedStyle(list).paddingBlockEnd).toBe('16px')
    expect(api.viewport!.scrollTop).toBe(0)
    expect(row(0).top - api.viewport!.getBoundingClientRect().top).toBe(16)
    expect(wrapper.findAll('[data-hn-data-list-item]').length).toBeLessThan(40)
    api.scrollToIndex(300, { align: 'start' })
    await vi.waitFor(() => expect(wrapper.find('[data-index="300"]').exists()).toBe(true))
    await vi.waitFor(() =>
      expect(Math.abs(row(300).top - api.viewport!.getBoundingClientRect().top)).toBeLessThan(2),
    )
    await wrapper.setProps({ style: { width: '280px' } })
    await vi.waitFor(() =>
      expect(getComputedStyle(list).gridTemplateColumns.split(' ')).toHaveLength(1),
    )
    await vi.waitFor(() => expect(wrapper.find('[data-index="300"]').exists()).toBe(true))
    expect(api.viewport!.scrollTop).toBeGreaterThan(10000)
    api.scrollToIndex(999, { align: 'end' })
    await vi.waitFor(() => expect(wrapper.find('[data-index="999"]').exists()).toBe(true))
    await vi.waitFor(() =>
      expect(
        Math.abs(row(999).bottom + 16 - api.viewport!.getBoundingClientRect().bottom),
      ).toBeLessThan(2),
    )
    expect(wrapper.findAll('[data-hn-data-list-item]').length).toBeLessThan(20)
  })

  it('retains focused grid items outside the visible window without inflating row heights', async () => {
    const wrapper = create({
      items: Array.from({ length: 500 }, (_, id) => ({ id, label: `Item ${id}` })),
      layout: 'grid',
      gridMin: '180px',
      gridGap: 'sm',
      itemClass: 'h-24 p-0',
      height: 240,
      virtualize: { estimateSize: 96, initialColumns: 3, overscan: 1 },
    })
    const api = wrapper.vm as unknown as DataListExpose
    await vi.waitFor(() => expect(api.viewport).toBeDefined())
    const focused = wrapper.get<HTMLButtonElement>('[data-row="0"]').element
    focused.focus()
    await nextTick()
    api.scrollToIndex(300, { align: 'start' })
    await vi.waitFor(() => expect(wrapper.find('[data-row="300"]').exists()).toBe(true))
    expect(document.activeElement).toBe(focused)
    const rect = wrapper.get('[data-index="300"]').element.getBoundingClientRect()
    expect(rect.height).toBe(96)
    await vi.waitFor(() =>
      expect(
        Math.abs(
          wrapper.get('[data-index="300"]').element.getBoundingClientRect().top -
            api.viewport!.getBoundingClientRect().top,
        ),
      ).toBeLessThan(2),
    )
    await expectNoA11yViolations(wrapper.element)
  })

  it('renders structured slots, stable layout controls and matching initial placeholders', async () => {
    const action = vi.fn()
    const wrapper = mount(DataList<Item>, {
      attachTo: document.body,
      props: {
        items: items.slice(0, 2),
        itemKey: 'id',
        itemTitle: 'label',
        itemDescription: item => `Description ${item.id}`,
        layoutToggle: true,
        style: { width: '600px' },
        height: 320,
      },
      slots: {
        media: () => h('span', 'Cover'),
        actions: ({ item }: DataListItemSlot<Item>) =>
          h('button', { onClick: action, 'data-action': item.id }, 'Open'),
      },
    })
    wrappers.push(wrapper)
    expect(wrapper.text()).toContain('Description 0')
    const button = wrapper.get('[data-action="0"]').element
    await userEvent.click(wrapper.get(`[aria-label="${zhCN.dataList.grid}"]`).element)
    expect(wrapper.attributes('data-layout')).toBe('grid')
    expect(wrapper.get('[data-action="0"]').element).toBe(button)
    await userEvent.click(button)
    expect(action).toHaveBeenCalledTimes(1)
    await expectNoA11yViolations(wrapper.element)
    await wrapper.setProps({
      height: undefined,
      style: { width: '260px' },
      layout: 'list',
      itemDescription: () =>
        'Very long description that must wrap within a narrow container without widening its row',
    })
    expect(
      wrapper.get('[data-hn-data-list-item]').element.getBoundingClientRect().width,
    ).toBeLessThanOrEqual(260)
    expect(wrapper.element.scrollWidth).toBeLessThanOrEqual(260)
    await wrapper.setProps({ height: 320 })
    await wrapper.setProps({ items: [], loading: true, placeholderCount: 2 })
    expect(wrapper.findAll('[data-hn-data-list-content] > li')).toHaveLength(2)
    expect(wrapper.get('[data-hn-data-list-content]').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('[data-action]').exists()).toBe(false)
    expect(wrapper.findAll('.hn-skeleton').length).toBeGreaterThan(2)
    await wrapper.setProps({ loading: false })
    expect(wrapper.text()).toContain(zhCN.dataList.empty)
    expect(wrapper.get('[role="status"]').element.getBoundingClientRect().height).toBe(320)
  })
})
