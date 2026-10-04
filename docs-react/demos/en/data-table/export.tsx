'use client'

import { useState } from 'react'
import { Button, DataTable, Inline, type DataTableKey } from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const { rows, columns } = tableDemo('en')
const entries = rows.slice(0, 5)

export default function Demo() {
  const [selected, setSelected] = useState<DataTableKey[]>([1, 2])

  return (
    <DataTable
      selected={selected}
      onSelectedChange={setSelected}
      rows={entries}
      columns={columns}
      rowKey="id"
      rowLabel="name"
      selectable
      label="Entries"
      renderToolbar={({ api }) => (
        <Inline wrap>
          <Button
            size="sm"
            variant="soft"
            tone="neutral"
            onClick={() => api.exportCsv({ formatted: true, filename: 'entries.csv' })}
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            variant="ghost"
            tone="neutral"
            disabled={!selected.length}
            onClick={() =>
              api.exportCsv({ scope: 'selected', formatted: true, filename: 'selected.csv' })
            }
          >
            Export selected
          </Button>
        </Inline>
      )}
    />
  )
}
