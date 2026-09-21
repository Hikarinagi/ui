import { expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Carousel from './Carousel.vue'
import type { CarouselIndicatorSlot, CarouselIndicatorsSlot } from './types'

it('renders custom indicators with the selected snap during SSR without requiring the indicators prop', async () => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(
          Carousel<number>,
          { items: [1, 2, 3], getKey: n => n, index: 1 },
          {
            default: ({ item }: { item: number }) => h('span', item),
            indicator: ({ index, active, snapCount }: CarouselIndicatorSlot) =>
              h('span', `${index + 1}/${snapCount}/${active}`),
          },
        ),
    }),
  )
  expect(html.match(/data-hn-carousel-indicator(?:\s|=|>)/g)).toHaveLength(3)
  expect(html).toContain('2/3/true')
  expect(html).toContain('1/3/false')
  expect(html).toContain('aria-label="转到第 2 组"')
})

it('renders a custom group during SSR and gives a full controls slot precedence', async () => {
  const render = (full: boolean) =>
    renderToString(
      createSSRApp({
        render: () =>
          h(
            Carousel<number>,
            { items: [1, 2, 3], getKey: n => n, index: 1 },
            {
              default: ({ item }: { item: number }) => h('span', item),
              indicators: ({ index, snapCount, viewportId }: CarouselIndicatorsSlot) =>
                h('output', { 'aria-controls': viewportId }, `Group ${index + 1}/${snapCount}`),
              ...(full ? { controls: () => h('span', 'Full controls') } : {}),
            },
          ),
      }),
    )
  const group = await render(false)
  expect(group).toContain('Group 2/3')
  expect(group).toContain('aria-label="上一组"')
  expect(group).toContain('aria-label="下一组"')
  const full = await render(true)
  expect(full).toContain('Full controls')
  expect(full).not.toContain('Group 2/3')
  expect(full).not.toContain('data-hn-carousel-indicators')
})

it('renders all keyed slide content and accessible controls without a browser', async () => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(
          Carousel<number>,
          { items: [1, 2, 3], getKey: n => n, label: 'Gallery', indicators: true, index: 1 },
          {
            default: ({ item }: { item: number }) =>
              h('a', { href: `/item/${item}` }, `Item ${item}`),
          },
        ),
    }),
  )
  expect(html.match(/data-hn-carousel-item/g)).toHaveLength(3)
  expect(html).toContain('aria-roledescription="轮播"')
  expect(html).toContain('aria-label="Gallery"')
  expect(html).toContain('href="/item/3"')
  expect(html).not.toContain('data-ready')
  expect(html).not.toContain('data-pending')
  expect(html).toContain('data-initial-index="1"')
  expect(html).toContain('--hn-carousel-initial-index:1')
  expect(html.match(/aria-label="转到第 \d 组"/g)).toHaveLength(3)
  expect(html).toContain('aria-label="转到第 2 组"')
  expect(html.match(/data-current=""/g)).toHaveLength(1)
  expect(html.match(/inert/g)).toHaveLength(2)
  expect(html).not.toMatch(/\sdisabled(?:\s|=|>)/)
})

it.each([
  { index: -1, selected: 0, prev: false, next: true },
  { index: 999, selected: 2, prev: true, next: false },
  { index: NaN, selected: 0, prev: false, next: true },
  { index: 0, loop: true, selected: 0, prev: true, next: true },
])('renders clamped selection and navigation in the controls slot: %o', async test => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(
          Carousel<number>,
          { items: [1, 2, 3], getKey: n => n, ...test },
          {
            default: ({ item }: { item: number }) => h('span', item),
            controls: (state: {
              index: number
              snapCount: number
              canPrev: boolean
              canNext: boolean
            }) =>
              h('output', `${state.index}/${state.snapCount}/${state.canPrev}/${state.canNext}`),
          },
        ),
    }),
  )
  expect(html).toContain(`<output>${test.selected}/3/${test.prev}/${test.next}</output>`)
})
it('renders a measurement placeholder with hidden measurable content, or an empty state', async () => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(
          Carousel<number>,
          { items: [1, 2], getKey: n => n, index: 1 },
          {
            default: ({ item }: { item: number }) => h('span', item),
            pending: () => h('span', 'Placeholder'),
          },
        ),
    }),
  )
  expect(html).toContain('data-pending')
  expect(html).toContain('aria-hidden="true" inert')
  expect(html).toContain('Placeholder')
  const empty = await renderToString(
    createSSRApp({
      render: () => h(Carousel<number>, { items: [], getKey: n => n }, { default: () => null }),
    }),
  )
  expect(empty).toContain('暂无内容')
})
