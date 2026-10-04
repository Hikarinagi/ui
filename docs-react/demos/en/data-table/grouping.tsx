'use client'

import { useState } from 'react'
import { DataTable } from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const { rows, columns } = tableDemo('en')
const entries = rows.slice(0, 8)
const groupedColumns = columns.map(column =>
  column.key === 'count' ? { ...column, aggregate: 'sum' as const } : column,
)

export default function Demo() {
  const [grouping, setGrouping] = useState(['status'])
  const [expandedGroups, setExpandedGroups] = useState(['status:active'])

  return (
    <DataTable
      grouping={grouping}
      onGroupingChange={setGrouping}
      expandedGroups={expandedGroups}
      onExpandedGroupsChange={setExpandedGroups}
      rows={entries}
      columns={groupedColumns}
      rowKey="id"
      label="Entries"
    />
  )
}
