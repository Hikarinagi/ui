'use client'

import { useState } from 'react'
import { DataTable, SearchInput, Text, Tag, Inline } from '@hina-ui/react'
import { useRemoteTableDemo } from '../../data-table'

export default function Demo() {
  const { rows, columns, statusLabels, total, loading, lastQuery, load } =
    useRemoteTableDemo('zh-CN')
  const [filter, setFilter] = useState('')

  return (
    <DataTable
      filter={filter}
      onFilterChange={setFilter}
      rows={rows}
      columns={columns}
      total={total}
      loading={loading}
      rowKey="id"
      manual
      pagination
      defaultPageSize={5}
      label="条目列表"
      onChange={load}
      renderToolbar={() => (
        <Inline justify="between">
          <SearchInput
            size="sm"
            value={filter}
            onValueChange={setFilter}
            placeholder="搜索名称"
            aria-label="搜索名称"
            className="w-64 max-w-full"
          />
          <Text size="sm" tone="muted">
            请求页 {lastQuery.page} · 返回 {rows.length} / {total}
          </Text>
        </Inline>
      )}
      renderCell={({ row, column }) =>
        column.key === 'status' ? (
          <Tag tone={row.status === 'active' ? 'success' : 'neutral'}>
            {statusLabels[row.status]}
          </Tag>
        ) : undefined
      }
    />
  )
}
