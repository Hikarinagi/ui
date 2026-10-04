'use client'

import { useState } from 'react'
import { DataTable, type DataTableKey } from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const { rows, columns } = tableDemo('en')
const entries = rows.slice(0, 4)

export default function Demo() {
  const [selected, setSelected] = useState<DataTableKey[]>([2])

  return (
    <DataTable
      selected={selected}
      onSelectedChange={setSelected}
      rows={entries}
      columns={columns}
      rowKey="id"
      rowLabel="name"
      selectable
      selectionMode="single"
      label="Entries"
    />
  )
}
