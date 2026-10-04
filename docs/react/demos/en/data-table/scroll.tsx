'use client'

import { DataTable } from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const { rows, columns } = tableDemo('en')
const wideColumns = columns.map(column => ({
  ...column,
  width: column.key === 'name' ? 320 : 200,
}))

export default function Demo() {
  return (
    <DataTable
      rows={rows}
      columns={wideColumns}
      rowKey="id"
      stickyHeader
      maxHeight={240}
      label="Entries"
    />
  )
}
