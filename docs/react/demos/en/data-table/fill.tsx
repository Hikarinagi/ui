'use client'

import { Stack, DataTable } from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const { rows, columns } = tableDemo('en')
const summaryColumns = columns.map(column =>
  column.key === 'count' ? { ...column, aggregate: 'sum' as const, footer: true } : column,
)

export default function Demo() {
  return (
    <Stack className="h-80 w-full">
      <DataTable
        rows={rows}
        columns={summaryColumns}
        rowKey="id"
        fill
        stickyHeader
        stickyFooter
        pagination
        defaultPageSize={15}
        label="Entries"
        renderColumnFooter={({ column }) => (column.key === 'name' ? 'Total' : undefined)}
      />
    </Stack>
  )
}
