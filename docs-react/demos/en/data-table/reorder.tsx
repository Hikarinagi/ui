'use client'

import { useState } from 'react'
import { DataTable } from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const source = tableDemo('en')
const columns = source.columns.map(column => ({ ...column, sortable: false }))

export default function Demo() {
  const [rows, setRows] = useState(() => source.rows.slice(0, 5))

  return (
    <DataTable
      rows={rows}
      onRowsChange={setRows}
      columns={columns}
      rowKey="id"
      rowLabel="name"
      reorderable
      label="Entries"
    />
  )
}
