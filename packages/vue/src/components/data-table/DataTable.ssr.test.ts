import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import DataTable from './DataTable.vue'

describe('DataTable SSR', () => {
  it('renders filtered and sorted rows and accessible controls without a browser', async () => {
    const app = createSSRApp({
      render: () =>
        h(DataTable, {
          rows: [
            { id: 1, name: 'First', count: 9 },
            { id: 2, name: 'Second', count: 2 },
          ],
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'count', label: 'Count', sortable: true },
          ],
          rowKey: row => (row as { id: number }).id,
          sorting: [{ key: 'count', desc: false }],
          caption: 'Entries',
          selectable: true,
          selected: [2],
        }),
    })
    const html = await renderToString(app)
    expect(html).toContain('<table')
    expect(html).toContain('<caption>')
    expect(html).toContain('aria-sort="ascending"')
    expect(html).toContain('aria-checked="mixed"')
    expect(html.indexOf('Second')).toBeLessThan(html.indexOf('First'))
  })
})
