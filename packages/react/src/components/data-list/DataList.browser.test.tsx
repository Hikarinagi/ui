import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, createRef, type ReactNode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { userEvent } from 'vitest/browser'
import { render, type RenderResult } from 'vitest-browser-react'
import { DataList } from './DataList'
import { zhCN } from '../../locale'
import type { DataListExpose, DataListItemSlot, DataListProps } from './types'
import { expectNoA11yViolations } from '../../../test/axe'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

const items = Array.from({ length: 23 }, (_, id) => ({ id, label: `Item ${id}` }))
type Item = (typeof items)[number]
type Props = Partial<DataListProps<Item>>
const screens: RenderResult[] = []
const roots: Array<() => Promise<void>> = []
afterEach(async () => {
  for (const screen of screens.splice(0)) await screen.unmount()
  for (const unmount of roots.splice(0)) await unmount()
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

const row = ({ item, index }: DataListItemSlot<Item>) => (
  <button type="button" data-row={item.id}>{`${item.label} (${index})`}</button>
)

async function mount(initial: Props, defaults: Props = {}) {
  const state = signal<Props>({ ...defaults, ...initial })
  const change = vi.fn()
  const api = createRef<DataListExpose>()
  function Harness() {
    const current = state.use()
    return (
      <DataList<Item>
        items={items}
        itemKey="id"
        {...current}
        ref={api}
        page={current.page ?? 1}
        onPageChange={page => (state.value = { ...state.value, page })}
        pageSize={current.pageSize ?? 10}
        onPageSizeChange={pageSize => (state.value = { ...state.value, pageSize })}
        layout={current.layout ?? 'list'}
        onLayoutChange={layout => (state.value = { ...state.value, layout })}
        onPaginationChange={change}
      />
    )
  }
  const screen = await render(<Harness />)
  screens.push(screen)
  const element = screen.container.firstElementChild as HTMLElement
  const find = (selector: string) =>
    element.matches(selector) ? element : element.querySelector<HTMLElement>(selector)
  return {
    element,
    change,
    api,
    get: (selector: string) => find(selector)!,
    find,
    findAll: (selector: string) => [...element.querySelectorAll<HTMLElement>(selector)],
    async setProps(next: Props) {
      state.value = { ...state.value, ...next }
      await tick()
    },
  }
}

function create(props: Props = {}) {
  return mount(props, { label: 'Items', style: { width: '600px' }, children: row })
}

type Wrapper = Awaited<ReturnType<typeof create>>

function surroundWithScroller(wrapper: Wrapper) {
  const outer = document.createElement('div')
  outer.style.cssText = 'height: 200px; overflow: auto; overflow-anchor: none'
  const spacer = document.createElement('div')
  spacer.style.height = '600px'
  const host = wrapper.element.parentElement!
  outer.append(spacer, host, spacer.cloneNode())
  document.body.append(outer)
  outer.scrollTop = 100
  return outer
}

async function hydrate(host: HTMLElement, ui: ReactNode) {
  const active = Reflect.get(globalThis, 'IS_REACT_ACT_ENVIRONMENT')
  Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
  let root!: ReturnType<typeof hydrateRoot>
  await act(async () => {
    root = hydrateRoot(host, ui, { onRecoverableError: error => console.warn(error) })
  })
  roots.push(async () => {
    await act(async () => root.unmount())
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', active)
  })
}

describe('DataList browser behavior', () => {
  it('pages local items once and announces the current page', async () => {
    const wrapper = await create({ pagination: true, pageSize: 5 })
    expect(wrapper.findAll('[data-row]')).toHaveLength(5)
    const next = wrapper
      .findAll('button')
      .find(button => button.getAttribute('aria-label') === zhCN.pagination.next)!
    await userEvent.click(next)
    await vi.waitFor(() => expect(wrapper.find('[data-row="5"]')).not.toBeNull())
    expect(wrapper.find('[data-row="0"]')).toBeNull()
    expect(wrapper.change.mock.calls).toEqual([[{ page: 2, pageSize: 5 }]])
    await expectNoA11yViolations(wrapper.element)
  })

  it('keeps keyed nodes and focus when switching layout, and wraps grids in LTR and RTL', async () => {
    const wrapper = await create({ items: items.slice(0, 4), gridMin: '12rem', gridGap: 'sm' })
    const button = wrapper.get('[data-row="0"]')
    button.focus()
    await wrapper.setProps({ layout: 'grid' })
    expect(wrapper.get('[data-row="0"]')).toBe(button)
    expect(document.activeElement).toBe(button)
    const rows = () => wrapper.findAll('li')
    expect(
      Math.abs(rows()[0]!.getBoundingClientRect().top - rows()[1]!.getBoundingClientRect().top),
    ).toBeLessThan(1)
    for (const dir of ['ltr', 'rtl']) {
      await wrapper.setProps({ dir, style: { width: '180px' } })
      const first = rows()[0]!.getBoundingClientRect()
      const second = rows()[1]!.getBoundingClientRect()
      expect(second.top).toBeGreaterThanOrEqual(first.bottom)
      expect(wrapper.element.scrollWidth).toBeLessThanOrEqual(180)
    }
  })

  it('allows itemClass to override vertical padding without specificity workarounds', async () => {
    const wrapper = await create({ itemClass: 'py-1' })
    expect(getComputedStyle(wrapper.get('li')).paddingBlockStart).toBe('4px')
    await wrapper.setProps({
      itemClass: (_item: Item, index: number) => (index === 0 ? 'py-8' : 'py-1'),
    })
    expect(getComputedStyle(wrapper.get('li')).paddingBlockStart).toBe('32px')
  })

  it('preserves existing rows during loading while blocking their interactions and paging', async () => {
    const wrapper = await create({ pagination: true, manual: true, hasNextPage: true })
    const row = wrapper.get('[data-row="0"]')
    await wrapper.setProps({ loading: true })
    expect(wrapper.get('[data-row="0"]')).toBe(row)
    expect(row.closest('[inert]')).not.toBeNull()
    expect(wrapper.element.getAttribute('aria-busy')).toBe('true')
    expect(wrapper.get('nav button:last-child').getAttribute('disabled')).not.toBeNull()
    await wrapper.setProps({ loading: false })
    expect(row.closest('[inert]')).toBeNull()
    await userEvent.click(wrapper.get('nav button:last-child'))
    expect(wrapper.change.mock.calls).toEqual([[{ page: 2, pageSize: 10 }]])
    expect(wrapper.findAll('[data-row]')).toHaveLength(23)
    await wrapper.setProps({ hasNextPage: false })
    expect(wrapper.get('nav button:last-child').getAttribute('disabled')).not.toBeNull()
  })

  it.each([false, true, { initialColumns: 2, estimateSize: 64 }])(
    'hydrates readable list content without replacing server nodes (virtual=%s)',
    async virtualize => {
      const component = () => (
        <DataList<Item>
          items={items}
          itemKey="id"
          virtualize={virtualize}
          height={200}
          {...(typeof virtualize === 'object'
            ? { defaultLayout: 'grid' as const, gridMin: '160px', style: { width: '360px' } }
            : {})}
        >
          {({ item }) => <span data-row={item.id}>{item.label}</span>}
        </DataList>
      )
      const host = document.createElement('div')
      host.innerHTML = renderToString(component())
      document.body.append(host)
      const first = host.querySelector('[data-row="0"]')
      expect(first).not.toBeNull()
      const warn = vi.spyOn(console, 'warn')
      const error = vi.spyOn(console, 'error')
      await hydrate(host, component())
      await tick()
      expect(host.querySelector('[data-row="0"]')).toBe(first)
      expect(warn.mock.calls.flat().join(' ')).not.toMatch(/hydration/i)
      expect(error.mock.calls.flat().join(' ')).not.toMatch(/hydration/i)
    },
  )

  it('renders a bounded virtual window and reveals later items when scrolled', async () => {
    const many = Array.from({ length: 10000 }, (_, id) => ({ id, label: `Item ${id}` }))
    const wrapper = await create({ items: many, virtualize: { estimateSize: 64 }, height: 200 })
    await vi.waitFor(() => expect(wrapper.find('[data-overlayscrollbars-viewport]')).not.toBeNull())
    const viewport = wrapper.get('[data-overlayscrollbars-viewport]')
    expect(wrapper.findAll('li').length).toBeLessThan(30)
    viewport.scrollTop = 5000
    await vi.waitFor(() =>
      expect(Number(wrapper.get('[data-row]').getAttribute('data-row'))).toBeGreaterThan(30),
    )
    expect(wrapper.findAll('li').length).toBeLessThan(30)
    await expectNoA11yViolations(wrapper.element)
  })

  it('starts each virtual page at the beginning after scrolling the previous page', async () => {
    const many = Array.from({ length: 300 }, (_, id) => ({ id, label: `Item ${id}` }))
    const wrapper = await create({
      items: many,
      virtualize: true,
      pagination: true,
      pageSize: 100,
      height: 200,
    })
    await vi.waitFor(() => expect(wrapper.find('[data-overlayscrollbars-viewport]')).not.toBeNull())
    wrapper.get('[data-overlayscrollbars-viewport]').scrollTop = 2000
    await vi.waitFor(() =>
      expect(Number(wrapper.get('[data-row]').getAttribute('data-row'))).toBeGreaterThan(10),
    )
    await wrapper.setProps({ page: 2 })
    await vi.waitFor(() => expect(wrapper.find('[data-row="100"]')).not.toBeNull())
    await vi.waitFor(() =>
      expect(wrapper.get('[data-overlayscrollbars-viewport]').scrollTop).toBe(0),
    )
  })

  it.each([
    { height: undefined, virtualize: false },
    { height: 200, virtualize: false },
    { height: 200, virtualize: true },
  ])(
    'keeps the containing page stationary when initial remote results arrive (%j)',
    async options => {
      const wrapper = await create({
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
      await tick()
      expect(scrollIntoView).not.toHaveBeenCalled()
      expect(outer.scrollTop).toBe(100)
    },
  )

  it.each([
    { height: undefined, virtualize: false },
    { height: 200, virtualize: false },
    { height: 200, virtualize: true },
  ])('resets only its own scroll viewport on page changes (%j)', async options => {
    const wrapper = await create({ ...options, pagination: true, pageSize: 10 })
    const outer = surroundWithScroller(wrapper)
    const api = wrapper.api
    if (options.height) {
      await vi.waitFor(() => expect(api.current?.viewport?.clientHeight).toBe(200))
      api.current!.viewport!.scrollTop = 200
      await vi.waitFor(() => expect(api.current!.viewport!.scrollTop).toBe(200))
    }
    await wrapper.setProps({ page: 2 })
    if (options.height) await vi.waitFor(() => expect(api.current!.viewport!.scrollTop).toBe(0))
    expect(outer.scrollTop).toBe(100)
  })

  it('keeps explicit item alignment inside a bounded nonvirtual viewport', async () => {
    const wrapper = await create({ height: 200, itemClass: 'h-16 p-0', divided: false })
    const outer = surroundWithScroller(wrapper)
    const api = wrapper.api
    await vi.waitFor(() => expect(api.current?.viewport?.clientHeight).toBe(200))
    const viewport = () => api.current!.viewport!
    const row = () => wrapper.get('[data-index="10"]').getBoundingClientRect()
    api.current!.scrollToIndex(10, { align: 'center' })
    await vi.waitFor(() =>
      expect(
        Math.abs(row().top + row().height / 2 - viewport().getBoundingClientRect().top - 100),
      ).toBeLessThan(1),
    )
    expect(outer.scrollTop).toBe(100)
    const previous = viewport().scrollTop
    api.current!.scrollToIndex(10)
    expect(viewport().scrollTop).toBe(previous)
    api.current!.scrollToIndex(10, { align: 'end' })
    await vi.waitFor(() =>
      expect(Math.abs(row().bottom - viewport().getBoundingClientRect().bottom)).toBeLessThan(1),
    )
    expect(outer.scrollTop).toBe(100)
  })

  it('formats only rendered virtual items and retains complete long titles', async () => {
    const title = vi.fn((item: Item) => `${item.label} ${'long title '.repeat(30)}`)
    const wrapper = await mount({
      items: Array.from({ length: 10000 }, (_, id) => ({ id, label: `Item ${id}` })),
      itemTitle: title,
      height: 200,
      virtualize: { estimateSize: 120, overscan: 1 },
      style: { width: '240px' },
    })
    await vi.waitFor(() => expect(wrapper.find('[data-hn-data-list-item]')).not.toBeNull())
    expect(new Set(title.mock.calls.map(([item]) => item.id)).size).toBeLessThan(20)
    const text = wrapper.get('[data-hn-data-list-item] .font-medium')
    expect(text.clientHeight).toBe(text.scrollHeight)
    expect(getComputedStyle(text).webkitLineClamp).toBe('none')
  })

  it('matches title-only skeletons to their content and aligns the footer with paging', async () => {
    const wrapper = await mount({
      items: items.slice(0, 3),
      itemTitle: 'label',
      placeholderCount: 3,
      pagination: true,
      pageSize: 2,
      style: { width: '600px' },
      renderFooter: () => <span data-summary="">3 items</span>,
    })
    const itemHeight = wrapper.get('[data-hn-data-list-item]').getBoundingClientRect().height
    const summary = wrapper.get('[data-summary]').getBoundingClientRect()
    const pagination = wrapper.get('nav').getBoundingClientRect()
    expect(
      Math.abs(summary.top + summary.height / 2 - pagination.top - pagination.height / 2),
    ).toBeLessThan(1)
    await wrapper.setProps({ items: [], loading: true })
    expect(wrapper.findAll('.hn-skeleton')).toHaveLength(3)
    expect(wrapper.get('[data-hn-data-list-content] li').getBoundingClientRect().height).toBe(
      itemHeight,
    )
    await wrapper.setProps({ items: items.slice(0, 1), loading: false })
    expect(wrapper.find('nav')).toBeNull()
    expect(wrapper.get('[data-summary]').textContent).toBe('3 items')
  })

  it('resolves percentage virtual heights and preserves them for empty loading states', async () => {
    const wrapper = await create({
      virtualize: true,
      height: '100%',
      style: { height: '240px', width: '400px' },
    })
    await vi.waitFor(() => expect(wrapper.find('[data-overlayscrollbars-viewport]')).not.toBeNull())
    expect(wrapper.get('[data-overlayscrollbars-viewport]').getBoundingClientRect().height).toBe(
      240,
    )
    await wrapper.setProps({ items: [], loading: true })
    expect(wrapper.get('[data-overlayscrollbars-viewport]').getBoundingClientRect().height).toBe(
      240,
    )
    expect(wrapper.element.getBoundingClientRect().height).toBe(240)
    await wrapper.setProps({ style: { height: '80px', width: '400px' } })
    expect(wrapper.get('[data-overlayscrollbars-viewport]').getBoundingClientRect().height).toBe(80)
  })
  it('keeps virtual grids bounded, measured, padded and anchored across column changes', async () => {
    const many = Array.from({ length: 1000 }, (_, id) => ({ id, label: `Item ${id}` }))
    const wrapper = await create({
      items: many,
      layout: 'grid',
      gridMin: '180px',
      gridGap: 'sm',
      contentClass: 'p-4',
      itemClass: (_item: Item, index: number) => (index % 3 === 0 ? 'h-24 p-0' : 'h-20 p-0'),
      virtualize: { estimateSize: 96, overscan: 1, initialColumns: 3 },
      height: 240,
    })
    const api = wrapper.api
    await vi.waitFor(() => expect(api.current?.viewport?.clientHeight).toBe(240))
    const viewport = () => api.current!.viewport!
    const list = wrapper.get('[data-hn-data-list-content]')
    const row = (id: number) => wrapper.get(`[data-index="${id}"]`).getBoundingClientRect()
    await vi.waitFor(() => expect(Math.abs(row(3).top - row(0).bottom - 8)).toBeLessThan(1))
    expect(getComputedStyle(list).paddingBlockStart).toBe('16px')
    expect(getComputedStyle(list).paddingBlockEnd).toBe('16px')
    expect(viewport().scrollTop).toBe(0)
    expect(row(0).top - viewport().getBoundingClientRect().top).toBe(16)
    expect(wrapper.findAll('[data-hn-data-list-item]').length).toBeLessThan(40)
    api.current!.scrollToIndex(300, { align: 'start' })
    await vi.waitFor(() => expect(wrapper.find('[data-index="300"]')).not.toBeNull())
    await vi.waitFor(() =>
      expect(Math.abs(row(300).top - viewport().getBoundingClientRect().top)).toBeLessThan(2),
    )
    await wrapper.setProps({ style: { width: '280px' } })
    await vi.waitFor(() =>
      expect(getComputedStyle(list).gridTemplateColumns.split(' ')).toHaveLength(1),
    )
    await vi.waitFor(() => expect(wrapper.find('[data-index="300"]')).not.toBeNull())
    expect(viewport().scrollTop).toBeGreaterThan(10000)
    api.current!.scrollToIndex(999, { align: 'end' })
    await vi.waitFor(() => expect(wrapper.find('[data-index="999"]')).not.toBeNull())
    await vi.waitFor(() =>
      expect(
        Math.abs(row(999).bottom + 16 - viewport().getBoundingClientRect().bottom),
      ).toBeLessThan(2),
    )
    expect(wrapper.findAll('[data-hn-data-list-item]').length).toBeLessThan(20)
  })

  it('retains focused grid items outside the visible window without inflating row heights', async () => {
    const wrapper = await create({
      items: Array.from({ length: 500 }, (_, id) => ({ id, label: `Item ${id}` })),
      layout: 'grid',
      gridMin: '180px',
      gridGap: 'sm',
      itemClass: 'h-24 p-0',
      height: 240,
      virtualize: { estimateSize: 96, initialColumns: 3, overscan: 1 },
    })
    const api = wrapper.api
    await vi.waitFor(() => expect(api.current?.viewport).toBeDefined())
    const focused = wrapper.get('[data-row="0"]')
    focused.focus()
    await tick()
    api.current!.scrollToIndex(300, { align: 'start' })
    await vi.waitFor(() => expect(wrapper.find('[data-row="300"]')).not.toBeNull())
    expect(document.activeElement).toBe(focused)
    const rect = wrapper.get('[data-index="300"]').getBoundingClientRect()
    expect(rect.height).toBe(96)
    await vi.waitFor(() =>
      expect(
        Math.abs(
          wrapper.get('[data-index="300"]').getBoundingClientRect().top -
            api.current!.viewport!.getBoundingClientRect().top,
        ),
      ).toBeLessThan(2),
    )
    await expectNoA11yViolations(wrapper.element)
  })

  it('renders structured slots, stable layout controls and matching initial placeholders', async () => {
    const action = vi.fn()
    const wrapper = await mount({
      items: items.slice(0, 2),
      itemTitle: 'label',
      itemDescription: item => `Description ${item.id}`,
      layoutToggle: true,
      style: { width: '600px' },
      height: 320,
      renderMedia: () => <span>Cover</span>,
      renderActions: ({ item }) => (
        <button onClick={action} data-action={item.id}>
          Open
        </button>
      ),
    })
    expect(wrapper.element.textContent).toContain('Description 0')
    const button = wrapper.get('[data-action="0"]')
    await userEvent.click(wrapper.get(`[aria-label="${zhCN.dataList.grid}"]`))
    expect(wrapper.element.getAttribute('data-layout')).toBe('grid')
    expect(wrapper.get('[data-action="0"]')).toBe(button)
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
      wrapper.get('[data-hn-data-list-item]').getBoundingClientRect().width,
    ).toBeLessThanOrEqual(260)
    await vi.waitFor(() => expect(wrapper.element.scrollWidth).toBeLessThanOrEqual(260))
    await wrapper.setProps({ height: 320 })
    await wrapper.setProps({ items: [], loading: true, placeholderCount: 2 })
    expect(wrapper.findAll('[data-hn-data-list-content] > li')).toHaveLength(2)
    expect(wrapper.get('[data-hn-data-list-content]').getAttribute('aria-hidden')).toBe('true')
    expect(wrapper.find('[data-action]')).toBeNull()
    expect(wrapper.findAll('.hn-skeleton').length).toBeGreaterThan(2)
    await wrapper.setProps({ loading: false })
    expect(wrapper.element.textContent).toContain(zhCN.dataList.empty)
    expect(wrapper.get('[role="status"]').getBoundingClientRect().height).toBe(320)
  })
})
