import { expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Masonry from './Masonry.vue'

it('renders every item in data order as a readable grid, without client geometry', async () => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(
          Masonry,
          {
            items: [3, 1, 2],
            getKey: (item: unknown) => Number(item),
            label: 'Gallery',
            minColumnWidth: 180,
          },
          { default: ({ item }: { item: number }) => h('button', `Item ${item}`) },
        ),
    }),
  )
  expect(html).toContain('role="list"')
  expect(html).toContain('aria-label="Gallery"')
  expect(html).toContain('--hn-masonry-min-width:180px')
  expect(html.match(/<li/g)).toHaveLength(3)
  expect(html.indexOf('Item 3')).toBeLessThan(html.indexOf('Item 1'))
  expect(html.indexOf('Item 1')).toBeLessThan(html.indexOf('Item 2'))
  expect(html).not.toContain('data-ready')
  expect(html).not.toContain('position:absolute')
})
it('renders fixed columns and meaningful empty/loading states on the server', async () => {
  const render = (loading: boolean) =>
    renderToString(
      createSSRApp({
        render: () =>
          h(
            Masonry,
            {
              items: [],
              getKey: () => '',
              columns: 2,
              loading,
              emptyText: 'Nothing saved',
            },
            { default: () => null },
          ),
      }),
    )
  expect(await render(false)).toContain('Nothing saved')
  const loading = await render(true)
  expect(loading).toContain('--hn-masonry-fixed-columns:2')
  expect(loading).toContain('aria-busy="true"')
  expect(loading).toContain('role="status"')
  expect(loading).not.toContain('Nothing saved')
})

it('renders pending and the same measurable items, hidden from interaction and accessibility', async () => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(
          Masonry,
          {
            items: [1, 2],
            getKey: (item: unknown) => Number(item),
            label: 'Photos',
          },
          {
            default: ({ item }: { item: number }) => h('button', `Photo ${item}`),
            pending: () => h('div', 'Photo placeholders'),
          },
        ),
    }),
  )
  expect(html).toContain('data-hn-masonry-pending')
  expect(html).toContain('Photo placeholders')
  expect(html).toContain('data-pending')
  expect(html).toMatch(/<ul[^>]*aria-hidden="true"[^>]*inert/)
  expect(html.match(/<li/g)).toHaveLength(2)
  expect(html).toContain('Photo 1')
  expect(html).not.toContain('data-ready')
})

it('uses pending for an initial request, while an idle empty list renders its empty state', async () => {
  const render = (loading: boolean) =>
    renderToString(
      createSSRApp({
        render: () =>
          h(
            Masonry,
            {
              items: [],
              getKey: () => '',
              loading,
            },
            {
              pending: () => 'Preparing cards',
              loading: () => 'Appending cards',
              empty: () => 'No cards',
            },
          ),
      }),
    )
  const loading = await render(true)
  expect(loading).toContain('Preparing cards')
  expect(loading).not.toContain('Appending cards')
  expect(loading).not.toContain('No cards')
  const empty = await render(false)
  expect(empty).toContain('No cards')
  expect(empty).not.toContain('Preparing cards')
})
