import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { VirtualList } from '../../index'

const items = Array.from({ length: 10000 }, (_, id) => ({ id, label: `Item ${id}` }))

describe('VirtualList SSR', () => {
  it('renders a bounded initial range with the full scroll extent and list semantics', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            VirtualList<(typeof items)[number]>,
            {
              items,
              getKey: item => item.id,
              estimateSize: 40,
              dynamic: false,
              height: 200,
            },
            { default: ({ item }: { item: (typeof items)[number] }) => item.label },
          ),
      }),
    )
    expect(html).toContain('height:200px')
    expect(html).toContain('height:400000px')
    expect(html).toContain('aria-setsize="10000"')
    expect(html).toContain('Item 0')
    expect(html).not.toContain('Item 9999')
    expect(html.match(/<li /g)?.length).toBeLessThan(20)
  })

  it('honors the initial offset and horizontal RTL geometry', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            VirtualList<(typeof items)[number]>,
            {
              items,
              getKey: item => item.id,
              estimateSize: 80,
              dynamic: false,
              initialOffset: 800,
              initialRect: { width: 240, height: 100 },
              orientation: 'horizontal',
              dir: 'rtl',
              overscan: 0,
            },
            { default: ({ item }: { item: (typeof items)[number] }) => item.label },
          ),
      }),
    )
    expect(html).toContain('translateX(-800px)')
    expect(html).toContain('Item 10')
    expect(html).not.toContain('Item 0<')
    expect(html).toContain('aria-posinset="11"')
  })

  it('separates empty and initial loading content without requiring browser APIs', async () => {
    for (const loading of [false, true]) {
      const html = await renderToString(
        createSSRApp({
          render: () =>
            h(
              VirtualList<number>,
              { items: [], getKey: item => item, loading },
              {
                default: () => 'Item',
                empty: () => 'Empty list',
                loading: () => 'Fetching items',
              },
            ),
        }),
      )
      expect(html).toContain(loading ? 'Fetching items' : 'Empty list')
      expect(html).not.toContain(loading ? 'Empty list' : 'Fetching items')
    }
  })
})
