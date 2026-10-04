'use client'

import { useState } from 'react'
import { DataList, Select, Text } from '@hina-ui/react'
import { dataListDemo } from '../../../../docs/app/demos/data-list'

const items = dataListDemo('zh-CN')
const sizes = [10, 20, 50].map(value => ({ value, label: `${value} 条 / 页` }))

export default function Demo() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  return (
    <DataList
      page={page}
      onPageChange={setPage}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      items={items}
      itemKey="id"
      itemTitle="title"
      itemDescription="subtitle"
      pagination
      className="max-w-2xl"
      renderHeader={({ pageSize: size, setPageSize: resize }) => (
        <>
          <Text size="sm" tone="muted">
            共 {items.length} 条
          </Text>
          <Select
            value={size}
            options={sizes}
            size="sm"
            className="w-36 max-w-full"
            aria-label="每页条数"
            onValueChange={value => resize(Number(value))}
          />
        </>
      )}
      renderMeta={({ item }) => (
        <Text size="xs" tone="muted">
          {item.released}
        </Text>
      )}
    />
  )
}
