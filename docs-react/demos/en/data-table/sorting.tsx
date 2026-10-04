'use client'

import { useState } from 'react'
import { DataTable, Text, Stack, type DataTableSort } from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const { rows, columns } = tableDemo('en')
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
        label="Entries"
      />
      <Text size="sm" tone="muted">
        {sorting.length
          ? sorting
              .map(
                sort =>
                  `${columns.find(column => column.key === sort.key)?.label ?? sort.key}: ${sort.desc ? 'descending' : 'ascending'}`,
              )
              .join(' · ')
          : 'Unsorted'}
      </Text>
    </Stack>
  )
}
