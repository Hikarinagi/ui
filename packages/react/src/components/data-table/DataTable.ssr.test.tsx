import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { DataTable } from './DataTable'

describe('DataTable SSR', () => {
  it('renders filtered and sorted rows and accessible controls without a browser', () => {
    const html = renderToString(
      <DataTable<{ id: number; name: string; count: number }>
        rows={[
          { id: 1, name: 'First', count: 9 },
          { id: 2, name: 'Second', count: 2 },
        ]}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'count', label: 'Count', sortable: true },
        ]}
        rowKey={row => row.id}
        sorting={[{ key: 'count', desc: false }]}
        caption="Entries"
        selectable
        selected={[2]}
      />,
    )
    expect(html).toContain('<table')
    expect(html).toContain('<caption>')
    expect(html).toContain('aria-sort="ascending"')
    expect(html).toContain('aria-checked="mixed"')
    expect(html.indexOf('Second')).toBeLessThan(html.indexOf('First'))
  })
})
