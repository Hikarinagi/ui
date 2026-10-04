'use client'

import { useState } from 'react'
import {
  DescriptionList,
  DescriptionTerm,
  DescriptionDetails,
  DataTable,
  type DataTableKey,
} from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const { rows, columns, statusLabels } = tableDemo('zh-CN')
const entries = rows.slice(0, 4)

export default function Demo() {
  const [expanded, setExpanded] = useState<DataTableKey[]>([1])

  return (
    <DataTable
      expanded={expanded}
      onExpandedChange={setExpanded}
      rows={entries}
      columns={columns}
      rowKey="id"
      rowLabel="name"
      expandable
      label="条目列表"
      renderExpansion={({ row }) => (
        <DescriptionList className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          <DescriptionTerm className="text-muted">ID</DescriptionTerm>
          <DescriptionDetails>{row.id}</DescriptionDetails>
          <DescriptionTerm className="text-muted">状态</DescriptionTerm>
          <DescriptionDetails>{statusLabels[row.status]}</DescriptionDetails>
          <DescriptionTerm className="text-muted">数量</DescriptionTerm>
          <DescriptionDetails>{row.count}</DescriptionDetails>
        </DescriptionList>
      )}
    />
  )
}
