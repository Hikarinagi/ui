'use client'

import { useState } from 'react'
import { DataTable, type DataTableKey } from '@hina-ui/react'
import { treeTableDemo } from '../../data-table'

const { rows, columns, getChildren } = treeTableDemo('en')

export default function Demo() {
  const [selected, setSelected] = useState<DataTableKey[]>([4])
  const [expanded, setExpanded] = useState<DataTableKey[]>([1])

  return (
    <DataTable
      selected={selected}
      onSelectedChange={setSelected}
      expanded={expanded}
      onExpandedChange={setExpanded}
      rows={rows}
      columns={columns}
      getChildren={getChildren}
      rowKey="id"
      rowLabel="name"
      selectable
      label="Entries"
    />
  )
}
