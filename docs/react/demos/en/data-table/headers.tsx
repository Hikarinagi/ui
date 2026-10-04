'use client'

import { DataTable, type DataTableColumn } from '@hina-ui/react'
import { tableDemo, type TableDemoRow } from '../../data-table'

const { rows, columns } = tableDemo('en')
const entries = rows.slice(0, 5)
const groupedColumns: DataTableColumn<TableDemoRow>[] = [
  { key: 'details', label: 'Details', children: [columns[0]!, columns[1]!] },
  { ...columns[2]!, aggregate: 'sum', footer: true },
]

export default function Demo() {
  return (
    <DataTable
      rows={entries}
      columns={groupedColumns}
      rowKey="id"
      label="Entries"
      renderColumnFooter={({ column }) => (column.key === 'name' ? 'Total' : undefined)}
    />
  )
}
