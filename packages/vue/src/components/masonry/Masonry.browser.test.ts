import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import axe from 'axe-core'
import Masonry from './Masonry.vue'
import type { MasonryProps } from './types'
import '../../../test/browser.css'

type Item = { id: number; height: number }
const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach(w => w.unmount())
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})
function setup(props: Partial<MasonryProps<Item>> = {}) {
  const items = ref<Item[]>([100, 200, 60, 80, 30, 90].map((height, id) => ({ id, height })))
  const wrapper = mount(Masonry<Item>, {
    attachTo: document.body,
    props: {
      items: items.value,
      getKey: item => item.id,
      columns: 3,
      gap: 'sm',
      label: 'Cards',
      ...props,
    },
    attrs: { style: 'width:616px' },
    slots: {
      default: ({ item }: { item: Item }) =>
        h(
          'button',
          { style: `display:block;width:100%;height:${item.height}px` },
          `Card ${item.id}`,
        ),
    },
  })
  wrappers.push(wrapper)
  return {
    wrapper,
    items,
    list: () => wrapper.get('ul').element as HTMLElement,
    cells: () => wrapper.findAll('li').map(li => li.element as HTMLElement),
  }
}
function geometry(s: ReturnType<typeof setup>) {
  const root = s.list().getBoundingClientRect()
  return s.cells().map(el => {
    const r = el.getBoundingClientRect()
    return { x: r.left - root.left, y: r.top - root.top, width: r.width, height: r.height }
  })
}
async function ready(s: ReturnType<typeof setup>) {
  await vi.waitFor(() => expect(s.list().hasAttribute('data-ready')).toBe(true))
}
async function settled() {
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}

it('packs real item heights into the shortest column with correct spacing and total height', async () => {
  const s = setup()
  await ready(s)
  const boxes = geometry(s)
  expect(boxes.map(b => Math.round(b.y))).toEqual([0, 0, 0, 68, 108, 146])
  expect(boxes.map(b => Math.round(b.x))).toEqual([0, 208, 416, 416, 0, 0])
  expect(s.list().offsetHeight).toBe(236)
  expect(s.wrapper.emitted('layout')?.at(-1)).toEqual([{ columns: 3, height: 236 }])
})
it('fills sequential columns when requested without changing DOM order', async () => {
  const s = setup({ sequential: true })
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
  const s = setup({ columns: undefined, minColumnWidth: 200 })
  await ready(s)
  expect(geometry(s)[0]!.width).toBeCloseTo(200, 1)
  s.wrapper.element.setAttribute('style', 'width:408px')
  await vi.waitFor(() => expect(geometry(s)[2]!.y).toBe(108))
  s.wrapper.element.setAttribute('style', 'width:150px')
  await vi.waitFor(() => expect(geometry(s)[1]!.y).toBe(108))
  expect(geometry(s).every(box => box.width === 150)).toBe(true)
})
it('automatically reflows after async content expands and collapses', async () => {
  const s = setup()
  await ready(s)
  const first = s.cells()[0]!.querySelector('button')!
  first.style.height = '300px'
  await vi.waitFor(() => expect(geometry(s)[4]!.y).toBe(156))
  first.style.height = '100px'
  await vi.waitFor(() => expect(geometry(s)[4]!.y).toBe(108))
})
it('measures wrapped content again at a new column width', async () => {
  const s = setup({ columns: 2 })
  const first = s.cells()[0]!.querySelector('button')!
  first.style.height = 'auto'
  first.textContent = 'Text wraps naturally as the container changes size. '.repeat(8)
  await ready(s)
  await settled()
  const before = first.offsetHeight
  s.wrapper.element.setAttribute('style', 'width:300px')
  await vi.waitFor(() => expect(first.offsetHeight).toBeGreaterThan(before))
  await vi.waitFor(() => {
    const boxes = geometry(s)
    for (const box of boxes)
      expect(box.y + box.height).toBeLessThanOrEqual(s.list().offsetHeight + 1)
  })
})
it('retains keyed DOM and focus when items are appended, reordered and removed', async () => {
  const s = setup()
  await ready(s)
  const button = s.cells()[1]!.querySelector('button')!
  button.focus()
  const initial = geometry(s)
  await s.wrapper.setProps({ items: [...s.items.value, { id: 7, height: 70 }] })
  await settled()
  expect(geometry(s).slice(0, 6)).toEqual(initial)
  expect(document.activeElement).toBe(button)
  await s.wrapper.setProps({ items: [s.items.value[1]!, s.items.value[0]!] })
  await vi.waitFor(() => expect(s.list().offsetHeight).toBe(200))
  expect(s.cells()[0]!.querySelector('button')).toBe(button)
  expect(document.activeElement).toBe(button)
})
it('uses logical column positions in RTL and follows runtime direction changes', async () => {
  const s = setup()
  await ready(s)
  await s.wrapper.setProps({ dir: 'rtl' })
  expect(geometry(s).map(b => Math.round(b.x))).toEqual([416, 208, 0, 0, 416, 416])
  await s.wrapper.setProps({ dir: 'ltr' })
  expect(geometry(s)[0]!.x).toBe(0)
})
it('preserves keyboard order and has no list accessibility violations', async () => {
  const s = setup()
  await ready(s)
  s.cells()[0]!.querySelector('button')!.focus()
  await userEvent.keyboard('{Tab}')
  expect(document.activeElement?.textContent).toBe('Card 1')
  await userEvent.keyboard('{Tab}')
  expect(document.activeElement?.textContent).toBe('Card 2')
  const results = await axe.run(s.wrapper.element, {
    rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
  })
  expect(results.violations).toEqual([])
})
it('handles a hidden container being revealed and explicit remeasurement', async () => {
  const s = setup()
  s.wrapper.element.setAttribute('style', 'display:none;width:616px')
  await settled()
  s.wrapper.element.setAttribute('style', 'width:408px')
  await s.wrapper.setProps({ columns: 2 })
  s.wrapper.vm.measure()
  await vi.waitFor(() => expect(geometry(s)[2]!.y).toBe(108))
  expect(s.wrapper.vm.element).toBe(s.wrapper.element)
})
it('updates spacing and fixed column count dynamically', async () => {
  const s = setup()
  await ready(s)
  await s.wrapper.setProps({ gap: 'lg', columns: 2 })
  await vi.waitFor(() => expect(geometry(s)[2]!.y).toBe(124))
  expect(geometry(s)[1]!.x).toBe(320)
})
it('keeps existing items during loading and supports custom empty and loading slots', async () => {
  const s = setup({ loading: true })
  await ready(s)
  expect(s.cells()).toHaveLength(6)
  expect(s.list().getAttribute('aria-busy')).toBe('true')
  expect(s.wrapper.find('[role=status]').exists()).toBe(true)
  await s.wrapper.setProps({ items: [], loading: false, emptyText: 'No cards' })
  await vi.waitFor(() => expect(s.list().offsetHeight).toBe(0))
  expect(s.wrapper.text()).toContain('No cards')
  const custom = mount(Masonry, {
    props: { items: [], getKey: () => '' },
    slots: { default: () => null, empty: () => 'Custom empty', loading: () => 'Custom loading' },
  })
  wrappers.push(custom)
  expect(custom.text()).toBe('Custom empty')
  await custom.setProps({ loading: true })
  expect(custom.text()).toBe('Custom loading')
})
it('follows inherited spacing token changes without scanning ancestor mutations', async () => {
  const s = setup({ gap: 'md' })
  await ready(s)
  const root = s.wrapper.element as HTMLElement
  root.style.setProperty('--hn-stack-gap', '32px')
  await vi.waitFor(() => expect(geometry(s)[3]!.y).toBe(92))
  root.style.setProperty('--hn-inline-gap', '20px')
  await vi.waitFor(() => expect(geometry(s)[1]!.x).toBeCloseTo(212, 1))
})
it('keeps a readable grid when ResizeObserver is unavailable', async () => {
  const original = window.ResizeObserver
  Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: undefined })
  try {
    const s = setup()
    await s.wrapper.setProps({ columns: 2 })
    s.wrapper.vm.measure()
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
  const s = setup()
  await ready(s)
  await settled()
  const mutations: MutationRecord[] = []
  const observer = new MutationObserver(records => mutations.push(...records))
  observer.observe(s.wrapper.element, { subtree: true, attributes: true })
  s.wrapper.vm.measure()
  await settled()
  expect(mutations).toHaveLength(0)
  observer.disconnect()
  s.wrapper.unmount()
  wrappers.pop()
  expect(disconnect).toHaveBeenCalledOnce()
})
it('hydrates the same complete markup without losing an item or producing mismatch warnings', async () => {
  const warn = vi.spyOn(console, 'warn')
  const App = defineComponent({
    setup: () => () =>
      h(
        Masonry,
        {
          items: [1, 2, 3],
          getKey: (item: unknown) => Number(item),
          minColumnWidth: 100,
          style: 'width:400px',
        },
        {
          default: ({ item }: { item: number }) =>
            h('button', { style: `height:${item * 30}px` }, `Item ${item}`),
        },
      ),
  })
  const host = document.createElement('div')
  host.innerHTML = await renderToString(createSSRApp(App))
  document.body.append(host)
  const oldNodes = Array.from(host.querySelectorAll('li'))
  expect(getComputedStyle(host.querySelector('ul')!).display).toBe('grid')
  const app = createSSRApp(App)
  app.mount(host)
  await nextTick()
  expect(Array.from(host.querySelectorAll('li'))).toEqual(oldNodes)
  expect(warn.mock.calls.flat().join(' ')).not.toMatch(/mismatch|hydration/i)
  app.unmount()
})

function setupPending(props: Partial<MasonryProps<number>> = {}) {
  const wrapper = mount(Masonry<number>, {
    attachTo: document.body,
    props: { items: [], getKey: item => item, loading: true, columns: 2, gap: 'sm', ...props },
    attrs: { style: 'width:416px;padding:8px' },
    slots: {
      default: ({ item }: { item: number }) =>
        h('button', { style: `display:block;height:${item * 50}px;width:100%` }, `Card ${item}`),
      pending: () => h('div', { style: 'height:240px' }, 'Preparing cards'),
      loading: () => 'Appending cards',
      empty: () => 'No cards',
    },
  })
  wrappers.push(wrapper)
  return wrapper
}

it('uses pending for the first client request and releases it only after positioning real data', async () => {
  const wrapper = setupPending()
  await settled()
  expect(wrapper.find('[data-hn-masonry-pending]').exists()).toBe(true)
  expect(wrapper.text()).not.toContain('Appending cards')
  await wrapper.setProps({ items: [1, 2, 3], loading: false })
  const list = wrapper.get('ul').element as HTMLElement
  const button = wrapper.get('button').element as HTMLButtonElement
  expect(list.inert).toBe(true)
  expect(getComputedStyle(list).opacity).toBe('0')
  button.focus()
  expect(document.activeElement).not.toBe(button)
  await vi.waitFor(() => expect(wrapper.find('[data-hn-masonry-pending]').exists()).toBe(false))
  expect(list.inert).toBe(false)
  expect(list.getAttribute('aria-hidden')).toBeNull()
  expect(getComputedStyle(list).opacity).toBe('1')
  expect(
    wrapper.findAll('li')[2]!.element.getBoundingClientRect().top -
      list.getBoundingClientRect().top,
  ).toBe(58)
  expect(list.offsetHeight).toBe(208)
  expect(list.offsetWidth).toBe(400)
})

it('keeps cards and focus visible during append loading, reflow and resizing', async () => {
  const wrapper = setupPending({ items: [1, 2, 3], loading: false })
  await vi.waitFor(() => expect(wrapper.find('[data-hn-masonry-pending]').exists()).toBe(false))
  const button = wrapper.get('button').element as HTMLButtonElement
  button.focus()
  await wrapper.setProps({ loading: true })
  expect(wrapper.find('[data-hn-masonry-pending]').exists()).toBe(false)
  expect(wrapper.text()).toContain('Appending cards')
  await wrapper.setProps({ items: [1, 2, 3, 4], loading: false, columns: 1 })
  await settled()
  expect(wrapper.find('[data-hn-masonry-pending]').exists()).toBe(false)
  expect(document.activeElement).toBe(button)
  expect(wrapper.get('ul').attributes('aria-busy')).toBe('false')
})

it('returns to pending for a new first batch after clearing, without masking an idle empty state', async () => {
  const wrapper = setupPending({ items: [1], loading: false })
  await settled()
  await wrapper.setProps({ items: [] })
  expect(wrapper.text()).toBe('No cards')
  await wrapper.setProps({ loading: true })
  expect(wrapper.find('[data-hn-masonry-pending]').exists()).toBe(true)
  await wrapper.setProps({ items: [2], loading: false })
  await vi.waitFor(() => expect(wrapper.find('[data-hn-masonry-pending]').exists()).toBe(false))
  expect((wrapper.get('ul').element as HTMLElement).offsetHeight).toBe(100)
})

it('waits for a usable container width before releasing pending', async () => {
  const host = document.createElement('div')
  host.style.cssText = 'display:none;width:400px'
  document.body.append(host)
  const wrapper = mount(Masonry<number>, {
    attachTo: host,
    props: { items: [1], getKey: item => item },
    slots: {
      default: () => h('button', { style: 'height:70px' }, 'Card'),
      pending: () => 'Preparing cards',
    },
  })
  wrappers.push(wrapper)
  await settled()
  expect(wrapper.find('[data-hn-masonry-pending]').exists()).toBe(true)
  host.style.display = 'block'
  await vi.waitFor(() => expect(wrapper.find('[data-hn-masonry-pending]').exists()).toBe(false))
  expect((wrapper.get('ul').element as HTMLElement).offsetHeight).toBe(70)
})

it('releases pending to a readable grid without ResizeObserver, including after a reset', async () => {
  const original = window.ResizeObserver
  Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: undefined })
  try {
    const wrapper = setupPending({ items: [1], loading: false })
    await nextTick()
    expect(wrapper.find('[data-hn-masonry-pending]').exists()).toBe(false)
    await wrapper.setProps({ items: [] })
    await wrapper.setProps({ items: [2] })
    expect(wrapper.find('[data-hn-masonry-pending]').exists()).toBe(false)
    expect(getComputedStyle(wrapper.get('ul').element).display).toBe('grid')
    expect((wrapper.get('ul').element as HTMLElement).inert).toBe(false)
  } finally {
    Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: original })
  }
})

it('hydrates a visible placeholder into a measured layout using the original item nodes', async () => {
  const warn = vi.spyOn(console, 'warn')
  const App = defineComponent({
    setup: () => () =>
      h(
        Masonry,
        {
          items: [1, 2, 3],
          getKey: (item: unknown) => Number(item),
          columns: 2,
          gap: 'sm',
          style: 'width:416px;padding:8px',
        },
        {
          default: ({ item }: { item: number }) =>
            h('button', { style: `height:${item * 50}px` }, `Item ${item}`),
          pending: () => h('div', { style: 'height:240px' }, 'Preparing cards'),
        },
      ),
  })
  const host = document.createElement('div')
  host.innerHTML = await renderToString(createSSRApp(App))
  document.body.append(host)
  const list = host.querySelector('ul')!
  const nodes = Array.from(list.children)
  expect(getComputedStyle(list).opacity).toBe('0')
  expect(list.inert).toBe(true)
  expect(list.offsetWidth).toBe(400)
  expect(host.offsetHeight).toBe(256)
  const app = createSSRApp(App)
  app.mount(host)
  await nextTick()
  expect(host.querySelector('[data-hn-masonry-pending]')).toBeNull()
  expect(Array.from(list.children)).toEqual(nodes)
  expect(list.hasAttribute('data-ready')).toBe(true)
  expect(list.inert).toBe(false)
  expect(list.offsetWidth).toBe(400)
  expect(list.offsetHeight).toBe(208)
  expect(warn.mock.calls.flat().join(' ')).not.toMatch(/mismatch|hydration/i)
  app.unmount()
})
