'use client'

import { DataTable, Tag } from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const { rows, columns, statusLabels } = tableDemo('zh-CN')
const entries = rows.slice(0, 4)

export default function Demo() {
  return (
    <DataTable
      rows={entries}
      columns={columns}
      rowKey="id"
      label="条目列表"
      renderCell={({ row, column }) =>
        column.key === 'status' ? (
          <Tag tone={row.status === 'active' ? 'success' : 'neutral'}>
            {statusLabels[row.status]}
          </Tag>
        ) : undefined
      }
    />
  )
}
