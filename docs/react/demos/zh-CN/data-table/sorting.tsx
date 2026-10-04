'use client'

import { useState } from 'react'
import { DataTable, Text, Stack, type DataTableSort } from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const { rows, columns } = tableDemo('zh-CN')
const entries = rows.slice(0, 6)

export default function Demo() {
  const [sorting, setSorting] = useState<DataTableSort[]>([])

  return (
    <Stack className="w-full">
      <DataTable
        sorting={sorting}
        onSortingChange={setSorting}
        rows={entries}
        columns={columns}
        rowKey="id"
        multiSort
        label="条目列表"
      />
      <Text size="sm" tone="muted">
        {sorting.length
          ? sorting
              .map(
                sort =>
                  `${columns.find(column => column.key === sort.key)?.label ?? sort.key} ${sort.desc ? '降序' : '升序'}`,
              )
              .join(' · ')
          : '未排序'}
      </Text>
    </Stack>
  )
}
