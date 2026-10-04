import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { VirtualList } from '../../index'

const items = Array.from({ length: 10000 }, (_, id) => ({ id, label: `Item ${id}` }))

describe('VirtualList SSR', () => {
  it('renders a bounded initial range with the full scroll extent and list semantics', async () => {
    const html = renderToString(
      <VirtualList
        items={items}
        getKey={item => item.id}
        estimateSize={40}
        dynamic={false}
        height={200}
      >
        {({ item }) => item.label}
      </VirtualList>,
    )
    expect(html).toContain('height:200px')
    expect(html).toContain('padding-block-end:399600px')
    expect(html).toContain('aria-setsize="10000"')
    expect(html).toContain('Item 0')
    expect(html).not.toContain('Item 9999')
    expect(html.match(/<li /g)?.length).toBeLessThan(20)
  })

  it('honors the initial offset and horizontal RTL geometry', async () => {
    const html = renderToString(
      <VirtualList
        items={items}
        getKey={item => item.id}
        estimateSize={80}
        dynamic={false}
        initialOffset={800}
        initialRect={{ width: 240, height: 100 }}
        orientation="horizontal"
        dir="rtl"
        overscan={0}
      >
        {({ item }) => item.label}
      </VirtualList>,
    )
    expect(html).toContain('padding-inline-start:800px')
    expect(html).toContain('Item 10')
    expect(html).not.toContain('Item 0<')
    expect(html).toContain('aria-posinset="11"')
  })

  it('separates empty and initial loading content without requiring browser APIs', async () => {
    for (const loading of [false, true]) {
      const html = renderToString(
        <VirtualList<number>
          items={[]}
          getKey={item => item}
          loading={loading}
          empty="Empty list"
          loadingContent="Fetching items"
        >
          {() => 'Item'}
        </VirtualList>,
      )
      expect(html).toContain(loading ? 'Fetching items' : 'Empty list')
      expect(html).not.toContain(loading ? 'Empty list' : 'Fetching items')
    }
  })
})
