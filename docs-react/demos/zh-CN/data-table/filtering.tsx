'use client'

import { useState } from 'react'
import { DataTable, SearchInput } from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const { rows, columns } = tableDemo('zh-CN')

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
      label="条目列表"
      renderToolbar={() => (
        <SearchInput
          size="sm"
          value={filter}
          onValueChange={setFilter}
          placeholder="筛选名称"
          aria-label="筛选名称"
          className="w-64 max-w-full"
        />
      )}
    />
  )
}
