'use client'

import { useState } from 'react'
import { DataTable, Select, type DataTableFilter } from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const { rows, columns, statusLabels } = tableDemo('en')
const options = Object.entries(statusLabels).map(([value, label]) => ({ value, label }))
const filteredColumns = columns.map(column =>
  column.key === 'status' ? { ...column, filterMode: 'equals' as const } : column,
)

export default function Demo() {
  const [filters, setFilters] = useState<DataTableFilter[]>([])

  return (
    <DataTable
      columnFilters={filters}
      onColumnFiltersChange={setFilters}
      rows={rows}
      columns={filteredColumns}
      rowKey="id"
      pagination
      defaultPageSize={5}
      label="Entries"
      renderHeader={({ column, filterValue, setFilter }) =>
        column.key === 'status' ? (
          <Select
            value={filterValue === undefined ? null : String(filterValue)}
            options={options}
            placeholder={column.label}
            aria-label={column.label}
            clearable
            size="sm"
            className="w-36 py-1"
            onValueChange={setFilter}
          />
        ) : undefined
      }
    />
  )
}
