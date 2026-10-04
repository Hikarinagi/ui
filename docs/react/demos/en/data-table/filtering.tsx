'use client'

import { useState } from 'react'
import { DataTable, SearchInput } from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const { rows, columns } = tableDemo('en')

export default function Demo() {
  const [filter, setFilter] = useState('')

  return (
    <DataTable
      filter={filter}
      onFilterChange={setFilter}
      rows={rows}
      columns={columns}
      rowKey="id"
      pagination
      defaultPageSize={5}
      label="Entries"
      renderToolbar={() => (
        <SearchInput
          size="sm"
          value={filter}
          onValueChange={setFilter}
          placeholder="Filter names"
          aria-label="Filter names"
          className="w-64 max-w-full"
        />
      )}
    />
  )
}
