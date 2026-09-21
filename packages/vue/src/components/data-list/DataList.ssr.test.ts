import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { DataList, type DataListItemSlot, type DataListProps } from '../../index'

const items = Array.from({ length: 10000 }, (_, id) => ({ id, label: `Item ${id}` }))
type Item = (typeof items)[number]

function render(props: Partial<DataListProps<Item>> & { page?: number; pageSize?: number } = {}) {
  return renderToString(
    createSSRApp({
      render: () =>
        h(
          DataList<Item>,
          { items: items.slice(0, 23), itemKey: 'id', label: 'Items', ...props },
          {
            default: ({ item, index }: DataListItemSlot<Item>) =>
              h('span', `${item.label} (${index})`),
            empty: () => 'Nothing here',
            loading: () => 'Fetching items',
          },
        ),
    }),
  )
}

describe('DataList SSR', () => {
  it('renders the requested page with accessible list semantics before hydration', async () => {
    const html = await render({ pagination: true, page: 2, pageSize: 10 })
    expect(html).toContain('aria-label="Items"')
    expect(html).toContain('Item 10 (10)')
    expect(html).toContain('Item 19 (19)')
    expect(html).not.toContain('Item 0 (0)')
    expect(html).not.toContain('Item 20 (20)')
    expect(html.match(/data-hn-data-list-item/g)).toHaveLength(10)
  })

  it('renders a remote page without slicing it again', async () => {
    const html = await render({
      manual: true,
      pagination: true,
      page: 5,
      items: items.slice(40, 43),
    })
    expect(html).toContain('Item 40 (40)')
    expect(html.match(/data-hn-data-list-item/g)).toHaveLength(3)
  })

  it('renders responsive grids without client measurements', async () => {
    const html = await render({ layout: 'grid', gridMin: '12rem' })
    expect(html).toContain('data-layout="grid"')
    expect(html).toContain('--hn-data-list-min:12rem')
    expect(html.match(/data-hn-data-list-item/g)).toHaveLength(23)
  })

  it('renders a bounded, readable virtual range on the server', async () => {
    const html = await render({ items, virtualize: { estimateSize: 64 }, height: 320 })
    expect(html).toContain('Item 0 (0)')
    expect(html).toContain('aria-setsize="10000"')
    expect(html.match(/<li /g)!.length).toBeLessThan(25)
    expect(html).not.toContain('Item 9999 (9999)')
  })

  it('separates initial loading from empty content', async () => {
    expect(await render({ items: [], loading: true })).toContain('Fetching items')
    expect(await render({ items: [], loading: true })).not.toContain('Nothing here')
    expect(await render({ items: [] })).toContain('Nothing here')
  })
  it('renders structured fields, typed slots and matching loading placeholders', async () => {
    const component = (loading: boolean) =>
      createSSRApp({
        render: () =>
          h(
            DataList<Item>,
            {
              items: loading ? [] : items.slice(0, 2),
              itemKey: 'id',
              itemTitle: 'label',
              loading,
              placeholderCount: 2,
            },
            {
              meta: ({ item }: DataListItemSlot<Item>) => h('span', `Metadata ${item.id}`),
            },
          ),
      })
    const ready = await renderToString(component(false))
    expect(ready).toContain('Item 0')
    expect(ready).toContain('Metadata 1')
    const loading = await renderToString(component(true))
    expect(loading).toContain('aria-busy="true"')
    expect(loading).toContain('hn-skeleton')
    expect(loading.match(/<li /g)).toHaveLength(2)
    expect(loading).not.toContain('Metadata')
  })

  it('renders bounded grid rows and handles invalid virtual estimates on the server', async () => {
    const html = await render({
      items,
      layout: 'grid',
      virtualize: { initialColumns: 3, estimateSize: 100, overscan: 1 },
      height: 200,
    })
    expect(html).toContain('Item 0 (0)')
    expect(html.match(/data-hn-data-list-item/g)!.length).toBeGreaterThanOrEqual(6)
    expect(html.match(/data-hn-data-list-item/g)!.length).toBeLessThan(20)
    const invalid = await render({
      items,
      virtualize: { initialColumns: NaN, estimateSize: Infinity, overscan: NaN },
    })
    expect(invalid).toContain('Item 0 (0)')
    expect(invalid).not.toContain('NaNpx')
    expect(invalid.match(/data-hn-data-list-item/g)!.length).toBeLessThan(20)
  })

  it('bounds initial virtual skeletons independently of a large page size', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(DataList<Item>, {
            items: [],
            itemKey: 'id',
            itemTitle: 'label',
            pagination: true,
            pageSize: 10000,
            virtualize: true,
            loading: true,
          }),
      }),
    )
    expect(html.match(/<li /g)).toHaveLength(3)
    expect(html.match(/hn-skeleton/g)).toHaveLength(3)
    expect(html).toContain('role="status"')
  })
})
