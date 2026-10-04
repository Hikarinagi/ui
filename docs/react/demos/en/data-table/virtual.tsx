'use client'

import { useRef } from 'react'
import { Stack, Button, DataTable, type DataTableHandle } from '@hina-ui/react'
import { tableDemo, type TableDemoRow } from '../../data-table'

const { columns } = tableDemo('en')
const rows: TableDemoRow[] = Array.from({ length: 10000 }, (_, index) => ({
  id: index + 1,
  name: 'Entry ' + (index + 1),
  status: 'active',
  count: index,
}))

export default function Demo() {
  const table = useRef<DataTableHandle<TableDemoRow>>(null)

  return (
    <DataTable
      ref={table}
      rows={rows}
      columns={columns}
      rowKey="id"
      rowLabel="name"
      virtualize={{ estimateSize: 44, overscan: 6 }}
      height={320}
      stickyHeader
      expandable
      label="Entries"
      renderToolbar={() => (
        <Button
          size="sm"
          variant="soft"
          tone="neutral"
          className="self-start"
          onClick={() => table.current?.api.scrollToRow(5000)}
        >
          Go to row 5,000
        </Button>
      )}
      renderExpansion={({ row }) => (
        <Stack className="flex h-32 items-center text-muted">{row.name} · Expanded content</Stack>
      )}
    />
  )
}
