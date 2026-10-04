'use client'

import { DataTable, type DataTableColumn } from '@hina-ui/react'
import { tableDemo, type TableDemoRow } from '../../data-table'

const { rows, columns } = tableDemo('zh-CN')
const entries = rows.slice(0, 5)
const groupedColumns: DataTableColumn<TableDemoRow>[] = [
  { key: 'details', label: '基本信息', children: [columns[0]!, columns[1]!] },
  { ...columns[2]!, aggregate: 'sum', footer: true },
]

export default function Demo() {
  return (
    <DataTable
      rows={entries}
      columns={groupedColumns}
      rowKey="id"
      label="条目列表"
      renderColumnFooter={({ column }) => (column.key === 'name' ? '合计' : undefined)}
    />
  )
}
