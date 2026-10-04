import { act, createRef, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render, type RenderResult } from 'vitest-browser-react'
import axe from 'axe-core'
import { Masonry } from './Masonry'
import type { MasonryExpose, MasonryProps } from './types'
import '../../../test/browser.css'

type Item = { id: number; height: number }
const screens: RenderResult[] = []
afterEach(async () => {
  for (const screen of screens.splice(0)) await screen.unmount()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

function harness<T>(initial: MasonryProps<T>, container?: HTMLElement) {
  let props = initial
  let assign: (next: MasonryProps<T>) => void = () => {}
  const handle = createRef<MasonryExpose>()
  const onLayout = vi.fn()
  function Host() {
    const [current, setCurrent] = useState(props)
    assign = setCurrent
    return <Masonry<T> {...current} ref={handle} onLayout={onLayout} />
  }
  return {
    handle,
    onLayout,
    mount: async () => {
      const screen = await render(<Host />, container ? { container } : undefined)
      screens.push(screen)
      return screen
    },
    setProps: async (next: Partial<MasonryProps<T>>) => {
      props = { ...props, ...next }
      flushSync(() => assign(props))
      await Promise.resolve()
    },
  }
}

async function setup(props: Partial<MasonryProps<Item>> = {}) {
  const items = [100, 200, 60, 80, 30, 90].map((height, id) => ({ id, height }))
  const h = harness<Item>({
    items,
    getKey: item => item.id,
    columns: 3,
    gap: 'sm',
    label: 'Cards',
    style: { width: '616px' },
    children: ({ item }) => (
      <button style={{ display: 'block', width: '100%', height: `${item.height}px` }}>
        {`Card ${item.id}`}
      </button>
    ),
    ...props,
  })
  const screen = await h.mount()
  const element = () => screen.container.firstElementChild as HTMLElement
  return {
    screen,
    items,
    element,
    handle: h.handle,
    onLayout: h.onLayout,
    setProps: h.setProps,
    unmount: () => screen.unmount(),
    list: () => element().querySelector('ul') as HTMLElement,
    cells: () => Array.from(element().querySelectorAll('li')),
  }
}
type Setup = Awaited<ReturnType<typeof setup>>
function geometry(s: Setup) {
  const root = s.list().getBoundingClientRect()
  return s.cells().map(el => {
    const r = el.getBoundingClientRect()
    return { x: r.left - root.left, y: r.top - root.top, width: r.width, height: r.height }
  })
}
async function ready(s: Setup) {
  await vi.waitFor(() => expect(s.list().hasAttribute('data-ready')).toBe(true))
}
async function settled() {
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}
function text(element: Element) {
  return (element.textContent ?? '').trim()
}
async function hydrate(host: HTMLElement, ui: ReactNode) {
  const active = Reflect.get(globalThis, 'IS_REACT_ACT_ENVIRONMENT')
  Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
  let root!: ReturnType<typeof hydrateRoot>
  await act(async () => {
    root = hydrateRoot(host, ui, { onRecoverableError: error => console.warn(error) })
  })
  return {
    unmount: async () => {
      await act(async () => root.unmount())
      Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', active)
    },
  }
}

it('packs real item heights into the shortest column with correct spacing and total height', async () => {
  const s = await setup()
  await ready(s)
  const boxes = geometry(s)
  expect(boxes.map(b => Math.round(b.y))).toEqual([0, 0, 0, 68, 108, 146])
  expect(boxes.map(b => Math.round(b.x))).toEqual([0, 208, 416, 416, 0, 0])
  expect(s.list().offsetHeight).toBe(236)
  expect(s.onLayout.mock.calls.at(-1)).toEqual([{ columns: 3, height: 236 }])
})
it('fills sequential columns when requested without changing DOM order', async () => {
  const s = await setup({ sequential: true })
  await ready(s)
  expect(geometry(s).map(b => Math.round(b.y))).toEqual([0, 0, 0, 108, 208, 68])
  expect(s.cells().map(el => el.textContent)).toEqual([
    'Card 0',
    'Card 1',
    'Card 2',
    'Card 3',
    'Card 4',
    'Card 5',
  ])
})
it('responds to its container width, including one column on narrow screens', async () => {
  const s = await setup({ columns: undefined, minColumnWidth: 200 })
  await ready(s)
  expect(geometry(s)[0]!.width).toBeCloseTo(200, 1)
  s.element().setAttribute('style', 'width:408px')
  await vi.waitFor(() => expect(geometry(s)[2]!.y).toBe(108))
  s.element().setAttribute('style', 'width:150px')
  await vi.waitFor(() => expect(geometry(s)[1]!.y).toBe(108))
  expect(geometry(s).every(box => box.width === 150)).toBe(true)
})
it('automatically reflows after async content expands and collapses', async () => {
  const s = await setup()
  await ready(s)
  const first = s.cells()[0]!.querySelector('button')!
  first.style.height = '300px'
  await vi.waitFor(() => expect(geometry(s)[4]!.y).toBe(156))
  first.style.height = '100px'
  await vi.waitFor(() => expect(geometry(s)[4]!.y).toBe(108))
})
it('measures wrapped content again at a new column width', async () => {
  const s = await setup({ columns: 2 })
  const first = s.cells()[0]!.querySelector('button')!
  first.style.height = 'auto'
  first.textContent = 'Text wraps naturally as the container changes size. '.repeat(8)
  await ready(s)
  await settled()
  const before = first.offsetHeight
  s.element().setAttribute('style', 'width:300px')
  await vi.waitFor(() => expect(first.offsetHeight).toBeGreaterThan(before))
  await vi.waitFor(() => {
    const boxes = geometry(s)
    for (const box of boxes)
      expect(box.y + box.height).toBeLessThanOrEqual(s.list().offsetHeight + 1)
  })
})
it('retains keyed DOM and focus when items are appended, reordered and removed', async () => {
  const s = await setup()
  await ready(s)
  const button = s.cells()[1]!.querySelector('button')!
  button.focus()
  const initial = geometry(s)
  await s.setProps({ items: [...s.items, { id: 7, height: 70 }] })
  await settled()
  expect(geometry(s).slice(0, 6)).toEqual(initial)
  expect(document.activeElement).toBe(button)
  await s.setProps({ items: [s.items[1]!, s.items[0]!] })
  await vi.waitFor(() => expect(s.list().offsetHeight).toBe(200))
  expect(s.cells()[0]!.querySelector('button')).toBe(button)
  expect(document.activeElement).toBe(button)
})
it('uses logical column positions in RTL and follows runtime direction changes', async () => {
  const s = await setup()
  await ready(s)
  await s.setProps({ dir: 'rtl' })
  expect(geometry(s).map(b => Math.round(b.x))).toEqual([416, 208, 0, 0, 416, 416])
  await s.setProps({ dir: 'ltr' })
  expect(geometry(s)[0]!.x).toBe(0)
})
it('preserves keyboard order and has no list accessibility violations', async () => {
  const s = await setup()
  await ready(s)
  s.cells()[0]!.querySelector('button')!.focus()
  await userEvent.keyboard('{Tab}')
  expect(document.activeElement?.textContent).toBe('Card 1')
  await userEvent.keyboard('{Tab}')
  expect(document.activeElement?.textContent).toBe('Card 2')
  const results = await axe.run(s.element(), {
    rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
  })
  expect(results.violations).toEqual([])
})
it('handles a hidden container being revealed and explicit remeasurement', async () => {
  const s = await setup()
  s.element().setAttribute('style', 'display:none;width:616px')
  await settled()
  s.element().setAttribute('style', 'width:408px')
  await s.setProps({ columns: 2 })
  s.handle.current!.measure()
  await vi.waitFor(() => expect(geometry(s)[2]!.y).toBe(108))
  expect(s.handle.current!.element).toBe(s.element())
})
it('updates spacing and fixed column count dynamically', async () => {
  const s = await setup()
  await ready(s)
  await s.setProps({ gap: 'lg', columns: 2 })
  await vi.waitFor(() => expect(geometry(s)[2]!.y).toBe(124))
  expect(geometry(s)[1]!.x).toBe(320)
})
it('keeps existing items during loading and supports custom empty and loading slots', async () => {
  const s = await setup({ loading: true })
  await ready(s)
  expect(s.cells()).toHaveLength(6)
  expect(s.list().getAttribute('aria-busy')).toBe('true')
  expect(s.element().querySelector('[role=status]') !== null).toBe(true)
  await s.setProps({ items: [], loading: false, emptyText: 'No cards' })
  await vi.waitFor(() => expect(s.list().offsetHeight).toBe(0))
  expect(text(s.element())).toContain('No cards')
  const custom = harness<unknown>({
    items: [],
    getKey: () => '',
    children: () => null,
    empty: 'Custom empty',
    loadingContent: 'Custom loading',
  })
  const screen = await custom.mount()
  expect(text(screen.container)).toBe('Custom empty')
  await custom.setProps({ loading: true })
  expect(text(screen.container)).toBe('Custom loading')
})
it('follows inherited spacing token changes without scanning ancestor mutations', async () => {
  const s = await setup({ gap: 'md' })
  await ready(s)
  const root = s.element()
  root.style.setProperty('--hn-stack-gap', '32px')
  await vi.waitFor(() => expect(geometry(s)[3]!.y).toBe(92))
  root.style.setProperty('--hn-inline-gap', '20px')
  await vi.waitFor(() => expect(geometry(s)[1]!.x).toBeCloseTo(212, 1))
})
it('keeps a readable grid when ResizeObserver is unavailable', async () => {
  const original = window.ResizeObserver
  Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: undefined })
  try {
    const s = await setup()
    await s.setProps({ columns: 2 })
    s.handle.current!.measure()
    await settled()
    expect(s.list().hasAttribute('data-ready')).toBe(false)
    expect(getComputedStyle(s.list()).display).toBe('grid')
    expect(s.cells()).toHaveLength(6)
  } finally {
    Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: original })
  }
})
it('does not keep writing geometry while idle, and disconnects observers on unmount', async () => {
  const disconnect = vi.spyOn(ResizeObserver.prototype, 'disconnect')
  const s = await setup()
  await ready(s)
  await settled()
  const mutations: MutationRecord[] = []
  const observer = new MutationObserver(records => mutations.push(...records))
  observer.observe(s.element(), { subtree: true, attributes: true })
  s.handle.current!.measure()
  await settled()
  expect(mutations).toHaveLength(0)
  observer.disconnect()
  await s.unmount()
  screens.splice(screens.indexOf(s.screen), 1)
  expect(disconnect).toHaveBeenCalledOnce()
})
it('hydrates the same complete markup without losing an item or producing mismatch warnings', async () => {
  const warn = vi.spyOn(console, 'warn')
  const error = vi.spyOn(console, 'error')
  const App = () => (
    <Masonry
      items={[1, 2, 3]}
      getKey={item => Number(item)}
      minColumnWidth={100}
      style={{ width: '400px' }}
    >
      {({ item }) => <button style={{ height: `${item * 30}px` }}>{`Item ${item}`}</button>}
    </Masonry>
  )
  const host = document.createElement('div')
  host.innerHTML = renderToString(<App />)
  document.body.append(host)
  const oldNodes = Array.from(host.querySelectorAll('li'))
  expect(getComputedStyle(host.querySelector('ul')!).display).toBe('grid')
  const app = await hydrate(host, <App />)
  expect(Array.from(host.querySelectorAll('li'))).toEqual(oldNodes)
  expect([...warn.mock.calls, ...error.mock.calls].flat().join(' ')).not.toMatch(/mismatch|hydrat/i)
  await app.unmount()
})

async function setupPending(props: Partial<MasonryProps<number>> = {}) {
  const h = harness<number>({
    items: [],
    getKey: item => item,
    loading: true,
    columns: 2,
    gap: 'sm',
    style: { width: '416px', padding: '8px' },
    children: ({ item }) => (
      <button style={{ display: 'block', height: `${item * 50}px`, width: '100%' }}>
        {`Card ${item}`}
      </button>
    ),
    pending: <div style={{ height: '240px' }}>Preparing cards</div>,
    loadingContent: 'Appending cards',
    empty: 'No cards',
    ...props,
  })
  const screen = await h.mount()
  const element = () => screen.container.firstElementChild as HTMLElement
  return {
    element,
    find: (selector: string) => element().querySelector(selector),
    get: (selector: string) => element().querySelector(selector) as HTMLElement,
    text: () => text(element()),
    setProps: h.setProps,
  }
}

it('uses pending for the first client request and releases it only after positioning real data', async () => {
  const wrapper = await setupPending()
  await settled()
  expect(wrapper.find('[data-hn-masonry-pending]') !== null).toBe(true)
  expect(wrapper.text()).not.toContain('Appending cards')
  await wrapper.setProps({ items: [1, 2, 3], loading: false })
  const list = wrapper.get('ul')
  const button = wrapper.get('button') as HTMLButtonElement
  expect(list.inert).toBe(true)
  expect(getComputedStyle(list).opacity).toBe('0')
  button.focus()
  expect(document.activeElement).not.toBe(button)
  await vi.waitFor(() => expect(wrapper.find('[data-hn-masonry-pending]') !== null).toBe(false))
  expect(list.inert).toBe(false)
  expect(list.getAttribute('aria-hidden')).toBeNull()
  expect(getComputedStyle(list).opacity).toBe('1')
  expect(
    wrapper.element().querySelectorAll('li')[2]!.getBoundingClientRect().top -
      list.getBoundingClientRect().top,
  ).toBe(58)
  expect(list.offsetHeight).toBe(208)
  expect(list.offsetWidth).toBe(400)
})

it('keeps cards and focus visible during append loading, reflow and resizing', async () => {
  const wrapper = await setupPending({ items: [1, 2, 3], loading: false })
  await vi.waitFor(() => expect(wrapper.find('[data-hn-masonry-pending]') !== null).toBe(false))
  const button = wrapper.get('button') as HTMLButtonElement
  button.focus()
  await wrapper.setProps({ loading: true })
  expect(wrapper.find('[data-hn-masonry-pending]') !== null).toBe(false)
  expect(wrapper.text()).toContain('Appending cards')
  await wrapper.setProps({ items: [1, 2, 3, 4], loading: false, columns: 1 })
  await settled()
  expect(wrapper.find('[data-hn-masonry-pending]') !== null).toBe(false)
  expect(document.activeElement).toBe(button)
  expect(wrapper.get('ul').getAttribute('aria-busy')).toBe('false')
})

it('returns to pending for a new first batch after clearing, without masking an idle empty state', async () => {
  const wrapper = await setupPending({ items: [1], loading: false })
  await settled()
  await wrapper.setProps({ items: [] })
  expect(wrapper.text()).toBe('No cards')
  await wrapper.setProps({ loading: true })
  expect(wrapper.find('[data-hn-masonry-pending]') !== null).toBe(true)
  await wrapper.setProps({ items: [2], loading: false })
  await vi.waitFor(() => expect(wrapper.find('[data-hn-masonry-pending]') !== null).toBe(false))
  expect(wrapper.get('ul').offsetHeight).toBe(100)
})

it('waits for a usable container width before releasing pending', async () => {
  const host = document.createElement('div')
  host.style.cssText = 'display:none;width:400px'
  document.body.append(host)
  const container = document.createElement('div')
  host.append(container)
  const h = harness<number>(
    {
      items: [1],
      getKey: item => item,
      children: () => <button style={{ height: '70px' }}>Card</button>,
      pending: 'Preparing cards',
    },
    container,
  )
  const screen = await h.mount()
  const find = (selector: string) => screen.container.querySelector(selector)
  await settled()
  expect(find('[data-hn-masonry-pending]') !== null).toBe(true)
  host.style.display = 'block'
  await vi.waitFor(() => expect(find('[data-hn-masonry-pending]') !== null).toBe(false))
  expect((find('ul') as HTMLElement).offsetHeight).toBe(70)
})

it('releases pending to a readable grid without ResizeObserver, including after a reset', async () => {
  const original = window.ResizeObserver
  Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: undefined })
  try {
    const wrapper = await setupPending({ items: [1], loading: false })
    expect(wrapper.find('[data-hn-masonry-pending]') !== null).toBe(false)
    await wrapper.setProps({ items: [] })
    await wrapper.setProps({ items: [2] })
    expect(wrapper.find('[data-hn-masonry-pending]') !== null).toBe(false)
    expect(getComputedStyle(wrapper.get('ul')).display).toBe('grid')
    expect(wrapper.get('ul').inert).toBe(false)
  } finally {
    Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: original })
  }
})

it('hydrates a visible placeholder into a measured layout using the original item nodes', async () => {
  const warn = vi.spyOn(console, 'warn')
  const error = vi.spyOn(console, 'error')
  const App = () => (
    <Masonry
      items={[1, 2, 3]}
      getKey={item => Number(item)}
      columns={2}
      gap="sm"
      style={{ width: '416px', padding: '8px' }}
      pending={<div style={{ height: '240px' }}>Preparing cards</div>}
    >
      {({ item }) => <button style={{ height: `${item * 50}px` }}>{`Item ${item}`}</button>}
    </Masonry>
  )
  const host = document.createElement('div')
  host.innerHTML = renderToString(<App />)
  document.body.append(host)
  const list = host.querySelector('ul')!
  const nodes = Array.from(list.children)
  expect(getComputedStyle(list).opacity).toBe('0')
  expect(list.inert).toBe(true)
  expect(list.offsetWidth).toBe(400)
  expect(host.offsetHeight).toBe(256)
  const app = await hydrate(host, <App />)
  expect(host.querySelector('[data-hn-masonry-pending]')).toBeNull()
  expect(Array.from(list.children)).toEqual(nodes)
  expect(list.hasAttribute('data-ready')).toBe(true)
  expect(list.inert).toBe(false)
  expect(list.offsetWidth).toBe(400)
  expect(list.offsetHeight).toBe(208)
  expect([...warn.mock.calls, ...error.mock.calls].flat().join(' ')).not.toMatch(/mismatch|hydrat/i)
  await app.unmount()
})
