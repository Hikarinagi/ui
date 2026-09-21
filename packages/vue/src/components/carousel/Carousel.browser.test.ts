import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, reactive, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import axe from 'axe-core'
import Carousel from './Carousel.vue'
import type {
  CarouselProps,
  CarouselItemSlot,
  CarouselExpose,
  CarouselControls,
  CarouselIndicatorSlot,
  CarouselIndicatorsSlot,
} from './types'
import '../../../test/browser.css'

type Item = { id: number; title: string }
const items = Array.from({ length: 7 }, (_, id) => ({ id, title: `Item ${id + 1}` }))
const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach(w => w.unmount())
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.useRealTimers()
})
function setup(
  initial: Partial<CarouselProps<Item>> = {},
  slots: Record<string, unknown> | (() => Record<string, unknown>) = {},
  initiallyHidden = false,
) {
  const width = ref(600)
  const hidden = ref(initiallyHidden)
  const props = reactive<CarouselProps<Item>>({
    items,
    getKey: item => item.id,
    index: 0,
    ...initial,
  })
  const w = mount(
    defineComponent({
      setup: () => () =>
        h(
          Carousel<Item>,
          {
            ...props,
            'onUpdate:index': (value: number | undefined) => {
              props.index = value
            },
            style: { width: `${width.value}px`, display: hidden.value ? 'none' : undefined },
          },
          {
            default: ({ item }: CarouselItemSlot<Item>) =>
              h('div', { style: 'height:160px; padding:16px' }, [
                h('button', item.title),
                h('input', { 'aria-label': `Notes for ${item.title}` }),
              ]),
            ...(typeof slots === 'function' ? slots() : slots),
          },
        ),
    }),
    { attachTo: document.body, global: { stubs: { transition: false } } },
  )
  wrappers.push(w)
  const component = w.getComponent({ name: 'HnCarousel' })
  const api = component.vm as unknown as CarouselExpose
  return {
    w,
    width,
    hidden,
    props,
    api,
    viewport: () => w.get('[data-hn-carousel-viewport]').element as HTMLElement,
    next: () => w.get('button[aria-label="下一组"]'),
    prev: () => w.get('button[aria-label="上一组"]'),
  }
}
async function ready(s: ReturnType<typeof setup>) {
  await vi.waitFor(() => expect(s.api.state.ready).toBe(true))
  await vi.waitFor(() => expect(s.api.state.visibleItems.length).toBeGreaterThan(0))
}

it('navigates controlled snaps without moving focus and excludes offscreen content from tab order', async () => {
  const s = setup({ indicators: true })
  await ready(s)
  expect(s.prev().attributes('disabled')).toBeDefined()
  await vi.waitFor(() =>
    expect(s.w.findAll('[data-hn-carousel-item]:not([inert])')).toHaveLength(1),
  )
  await userEvent.click(s.next().element)
  expect(s.props.index).toBe(1)
  expect(document.activeElement).toBe(s.next().element)
  await vi.waitFor(() =>
    expect(s.w.get('[data-hn-carousel-item]:not([inert])').text()).toBe('Item 2'),
  )
  await userEvent.click(s.w.get('button[aria-label="转到第 4 组"]').element)
  expect(s.props.index).toBe(3)
  const result = await axe.run(s.w.element, {
    rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
  })
  expect(result.violations).toEqual([])
})

it('supports RTL viewport keyboard navigation without intercepting nested form controls', async () => {
  const s = setup({ dir: 'rtl' })
  await ready(s)
  s.viewport().focus()
  await userEvent.keyboard('{ArrowLeft}')
  expect(s.props.index).toBe(1)
  await userEvent.keyboard('{Home}')
  expect(s.props.index).toBe(0)
  await vi.waitFor(() => expect(s.api.state.visibleItems).toEqual([0]))
  const input = s.w.get('[data-hn-carousel-item] input').element as HTMLInputElement
  input.focus()
  await userEvent.keyboard('{ArrowLeft}')
  expect(s.props.index).toBe(0)
  s.viewport().focus()
  await userEvent.keyboard('{End}')
  expect(s.props.index).toBe(6)
})

it('keeps navigation and accessible button semantics when indicator contents are customized', async () => {
  const custom = ref(true)
  const s = setup({ arrows: false }, () =>
    custom.value
      ? {
          indicator: ({ index, active, snapCount }: CarouselIndicatorSlot) =>
            h('span', { 'data-custom-indicator': '' }, `${index + 1}/${snapCount}/${active}`),
        }
      : {},
  )
  await ready(s)
  const buttons = s.w.findAll('[data-hn-carousel-indicator]')
  expect(buttons).toHaveLength(items.length)
  expect(buttons[0]!.text()).toBe('1/7/true')
  const fourth = buttons[3]!.element as HTMLButtonElement
  expect(fourth.getAttribute('aria-label')).toBe('转到第 4 组')
  expect(fourth.getAttribute('aria-controls')).toBe(s.viewport().id)
  fourth.focus()
  await userEvent.keyboard('{Enter}')
  expect(s.props.index).toBe(3)
  expect(document.activeElement).toBe(fourth)
  expect(fourth.getAttribute('aria-disabled')).toBe('true')
  expect(fourth.textContent).toBe('4/7/true')
  const second = buttons[1]!.element as HTMLButtonElement
  second.focus()
  await userEvent.keyboard(' ')
  expect(s.props.index).toBe(1)
  expect(document.activeElement).toBe(second)
  custom.value = false
  await nextTick()
  expect(s.w.find('[data-hn-carousel-indicators]').exists()).toBe(false)
  custom.value = true
  await nextTick()
  expect(s.w.findAll('[data-custom-indicator]')).toHaveLength(items.length)
})

it('replaces the entire indicator group while preserving arrows and exposing snap controls', async () => {
  const s = setup(
    {},
    {
      indicators: (c: CarouselIndicatorsSlot) =>
        h(
          'button',
          {
            'data-custom-progress': '',
            'aria-controls': c.viewportId,
            onClick: () => c.scrollTo(c.snapCount - 1),
          },
          `${c.index + 1}/${c.snapCount}`,
        ),
      indicator: () => h('span', 'Lower-priority indicator'),
    },
  )
  await ready(s)
  expect(s.w.findAll('[data-hn-carousel-indicator]')).toHaveLength(0)
  expect(s.w.text()).not.toContain('Lower-priority indicator')
  const progress = () => s.w.get('[data-custom-progress]')
  expect(progress().text()).toBe('1/7')
  expect(progress().attributes('aria-controls')).toBe(s.viewport().id)
  await userEvent.click(s.next().element)
  expect(progress().text()).toBe('2/7')
  await userEvent.click(progress().element)
  expect(s.props.index).toBe(6)
  expect(s.next().attributes('disabled')).toBeDefined()
  await userEvent.click(s.prev().element)
  expect(s.props.index).toBe(5)
})

it('groups responsive cards, recalculates on resize and exposes custom controls', async () => {
  const s = setup(
    { slidesToScroll: 'auto', itemClass: 'basis-1/2 @min-[500px]/hn-carousel:basis-1/3' },
    {
      controls: (c: CarouselControls) =>
        h('button', { onClick: c.next, disabled: !c.canNext }, `${c.index + 1}/${c.snapCount}`),
    },
  )
  await ready(s)
  expect(s.api.state.snapCount).toBe(3)
  await vi.waitFor(() => expect(s.api.state.visibleItems).toEqual([0, 1, 2]))
  const cell = s.w.get('[data-hn-carousel-item]').element
  const before = cell.getBoundingClientRect().width
  s.width.value = 360
  await vi.waitFor(() => expect(s.api.state.snapCount).toBe(4))
  expect(cell.getBoundingClientRect().width).toBeLessThan(before)
  await userEvent.click(s.w.get('.hn-carousel > div:last-of-type > button').element)
  expect(s.props.index).toBe(1)
})

it('loops when space permits, clamps after item removal, and handles empty-to-populated content', async () => {
  const s = setup({ loop: true, index: 6 })
  await ready(s)
  await userEvent.click(s.next().element)
  expect(s.props.index).toBe(0)
  s.props.index = 6
  await nextTick()
  s.props.items = items.slice(0, 2)
  await vi.waitFor(() => expect(s.api.state.snapCount).toBe(2))
  expect(s.api.state.index).toBeLessThan(2)
  s.props.items = []
  await vi.waitFor(() => expect(s.api.state.ready).toBe(false))
  expect(s.w.text()).toContain('暂无内容')
  s.props.items = items
  await ready(s)
  expect(s.api.state.snapCount).toBe(7)
})

it.each(['ltr', 'rtl'] as const)(
  'regroups unequal cards after container and content resizing in %s',
  async dir => {
    const widths = reactive([128, 212, 341, 131, 163, 136, 528])
    const s = setup(
      { dir, slidesToScroll: 'auto', itemClass: 'basis-auto' },
      {
        default: ({ item, index }: CarouselItemSlot<Item>) =>
          h(
            'div',
            {
              'data-card': '',
              style: { width: `min(${widths[index]}px, 100cqw)`, height: '160px' },
            },
            item.title,
          ),
      },
    )
    await ready(s)
    const cards = () => s.w.findAll('[data-card]').map(card => card.element.getBoundingClientRect())
    expect(new Set(cards().map(card => card.width)).size).toBeGreaterThan(3)
    const wideCount = s.api.state.snapCount
    s.width.value = 360
    await vi.waitFor(() => expect(s.api.state.snapCount).toBeGreaterThan(wideCount))
    expect(cards().every(card => card.width <= 360)).toBe(true)
    const narrowCount = s.api.state.snapCount
    widths[0] = 330
    widths[1] = 330
    await vi.waitFor(() => expect(s.api.state.snapCount).toBeGreaterThan(narrowCount))
    expect(s.viewport().getBoundingClientRect().width).toBe(360)
    expect(cards()[0]!.width).toBe(330)
    s.api.scrollTo(s.api.state.snapCount - 1, true)
    await nextTick()
    expect(s.api.state.canNext).toBe(false)
    const edge = dir === 'rtl' ? 'left' : 'right'
    expect(
      Math.abs(cards().at(-1)![edge] - s.viewport().getBoundingClientRect()[edge]),
    ).toBeLessThan(1)
    s.width.value = 900
    await vi.waitFor(() => expect(s.api.state.snapCount).toBeLessThan(narrowCount))
    expect(s.api.state.index).toBeLessThan(s.api.state.snapCount)
    s.api.scrollTo(0, true)
    await nextTick()
    expect(s.api.state.canPrev).toBe(false)
  },
)

it('moves vertically and can disable pointer dragging independently of navigation', async () => {
  const s = setup({
    orientation: 'vertical',
    viewportClass: 'h-80',
    itemClass: 'basis-1/2',
    draggable: false,
  })
  await ready(s)
  const before = s.w.get('[data-hn-carousel-item]').element.getBoundingClientRect()
  s.viewport().focus()
  await userEvent.keyboard('{ArrowDown}')
  expect(s.props.index).toBe(1)
  await vi.waitFor(() =>
    expect(s.w.get('[data-hn-carousel-item]').element.getBoundingClientRect().y).toBeLessThan(
      before.y - 100,
    ),
  )
  expect(s.w.get('[data-hn-carousel-item]').element.getBoundingClientRect().x).toBe(before.x)
})

it('preserves the requested starting position while initially hidden and normalizes invalid models', async () => {
  const s = setup({ index: 3 }, { pending: () => h('div', 'Waiting') }, true)
  await nextTick()
  expect(s.api.state.ready).toBe(false)
  expect(s.props.index).toBe(3)
  expect(s.w.getComponent({ name: 'HnCarousel' }).emitted('ready')).toBeUndefined()
  s.hidden.value = false
  await ready(s)
  await vi.waitFor(() => expect(s.api.state.visibleItems).toEqual([3]))
  expect(s.w.getComponent({ name: 'HnCarousel' }).emitted('ready')).toHaveLength(1)
  s.props.index = -2
  await vi.waitFor(() => expect(s.props.index).toBe(0))
  s.props.index = NaN
  await vi.waitFor(() => expect(s.props.index).toBe(0))
  s.hidden.value = true
  await nextTick()
  s.hidden.value = false
  await nextTick()
  expect(s.w.find('[data-hn-carousel-pending]').exists()).toBe(false)
})

it('pauses rotation on focus, requires explicit restart and clears timers on unmount', async () => {
  const s = setup({ autoplay: 1000, loop: true })
  await ready(s)
  await userEvent.unhover(s.w.element)
  await vi.waitFor(() => expect(s.api.state.playing).toBe(true))
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  s.api.play()
  await nextTick()
  // Re-arm with fake timers through the public controls.
  s.api.pause()
  await nextTick()
  s.api.play()
  await nextTick()
  await vi.advanceTimersByTimeAsync(1001)
  expect(s.props.index).toBe(1)
  s.viewport().focus()
  await nextTick()
  expect(s.api.state.playing).toBe(false)
  s.viewport().blur()
  await vi.advanceTimersByTimeAsync(2000)
  expect(s.props.index).toBe(1)
  s.api.play()
  await nextTick()
  expect(s.api.state.playing).toBe(true)
  s.w.unmount()
  wrappers.splice(wrappers.indexOf(s.w), 1)
  expect(vi.getTimerCount()).toBe(0)
})

it('temporarily pauses on hover and preserves a pointer pause-button intent across focus', async () => {
  const s = setup({ autoplay: 1000, loop: true })
  await ready(s)
  await userEvent.unhover(s.w.element)
  await vi.waitFor(() => expect(s.api.state.playing).toBe(true))
  await s.w.trigger('mouseenter')
  expect(s.api.state.playing).toBe(false)
  await s.w.trigger('mouseleave')
  expect(s.api.state.playing).toBe(true)
  await userEvent.click(s.w.get('[data-hn-carousel-rotation]').element)
  await s.w.trigger('mouseleave')
  expect(s.api.state.playing).toBe(false)
  expect(s.w.get('[data-hn-carousel-rotation]').text()).toBe('开始自动播放')
})

it('hydrates one set of slides and replaces a same-size pending slot after initial positioning', async () => {
  const App = defineComponent({
    render: () =>
      h(
        Carousel<Item>,
        { items, getKey: item => item.id, index: 2, label: 'Gallery' },
        {
          default: ({ item }: CarouselItemSlot<Item>) =>
            h('div', { style: 'height:160px' }, item.title),
          pending: () => h('div', { style: 'height:160px' }, 'Loading'),
        },
      ),
  })
  const host = document.createElement('div')
  host.style.width = '600px'
  host.innerHTML = await renderToString(createSSRApp(App))
  document.body.append(host)
  const nodes = [...host.querySelectorAll('[data-hn-carousel-item]')]
  const height = host.offsetHeight
  const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const app = createSSRApp(App)
  try {
    app.mount(host)
    await vi.waitFor(() => expect(host.querySelector('[data-hn-carousel-pending]')).toBeNull())
    expect([...host.querySelectorAll('[data-hn-carousel-item]')]).toEqual(nodes)
    expect(host.offsetHeight).toBe(height)
    await vi.waitFor(() =>
      expect(host.querySelector('[data-hn-carousel-item]:not([inert])')?.textContent).toBe(
        'Item 3',
      ),
    )
    expect(warning.mock.calls.filter(args => String(args[0]).includes('Hydration'))).toEqual([])
  } finally {
    app.unmount()
  }
})

it.each([
  { index: 0 },
  { index: 2 },
  { index: 2, loop: true, gap: 'xl' as const },
  { index: 6, loop: true, gap: 'none' as const },
  { index: 2, dir: 'rtl' as const },
  { index: 2, align: 'center' as const, containScroll: false as const },
  { index: 2, orientation: 'vertical' as const, viewportClass: 'h-80' },
])('renders the final slide position and indicator DOM before hydration: %o', async props => {
  const App = defineComponent({
    render: () =>
      h(
        Carousel<Item>,
        { items, getKey: item => item.id, indicators: true, ...props },
        {
          default: ({ item }: CarouselItemSlot<Item>) =>
            h('div', { 'data-card': '', style: 'height:160px' }, item.title),
        },
      ),
  })
  const host = document.createElement('div')
  host.style.width = '600px'
  host.innerHTML = await renderToString(createSSRApp(App))
  document.body.append(host)
  const slides = [...host.querySelectorAll('[data-hn-carousel-item]')]
  const dots = [...host.querySelectorAll('button[aria-label^="转到"]')]
  expect(dots).toHaveLength(items.length)
  const current = dots[props.index]!
  expect(current.getAttribute('aria-disabled')).toBe('true')
  const card = slides[props.index]!.firstElementChild!
  const viewport = host.querySelector('[data-hn-carousel-viewport]')!
  const before = card.getBoundingClientRect()
  const bounds = viewport.getBoundingClientRect()
  expect(Math.abs(before.x - bounds.x)).toBeLessThan(1)
  expect(Math.abs(before.y - bounds.y)).toBeLessThan(1)
  const controlsBefore = current.getBoundingClientRect()
  expect(host.querySelector('[data-hn-carousel-pending]')).toBeNull()
  expect(host.querySelectorAll('[data-hn-carousel-item]:not([inert])')).toHaveLength(1)
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const app = createSSRApp(App)
  try {
    app.mount(host)
    await vi.waitFor(() => expect(host.querySelector('[data-ready]')).not.toBeNull())
    expect([...host.querySelectorAll('[data-hn-carousel-item]')]).toEqual(slides)
    expect([...host.querySelectorAll('button[aria-label^="转到"]')]).toEqual(dots)
    const after = card.getBoundingClientRect()
    expect(Math.abs(after.x - before.x)).toBeLessThan(1)
    expect(Math.abs(after.y - before.y)).toBeLessThan(1)
    expect(Math.abs(current.getBoundingClientRect().x - controlsBefore.x)).toBeLessThan(1)
    expect(Math.abs(current.getBoundingClientRect().y - controlsBefore.y)).toBeLessThan(1)
    expect(warn.mock.calls.filter(args => String(args[0]).includes('Hydration'))).toEqual([])
  } finally {
    app.unmount()
  }
})
