'use client'

import { useState } from 'react'
import { Button, DataTable, Empty, Stack } from '@hina-ui/react'
import { tableDemo, type TableDemoRow } from '../../data-table'

const { rows, columns } = tableDemo('zh-CN')
const entries = rows.slice(0, 3)
const noRows: TableDemoRow[] = []

export default function Demo() {
  const [loading, setLoading] = useState(false)

  return (
    <Stack className="w-full">
      <Button
        size="sm"
        variant="soft"
        tone="neutral"
        className="self-start"
        onClick={() => setLoading(!loading)}
      >
        切换加载状态
      </Button>
      <DataTable rows={entries} columns={columns} rowKey="id" loading={loading} label="条目列表" />
      <DataTable
        rows={noRows}
        columns={columns}
        rowKey="id"
        label="条目列表"
        empty={<Empty size="sm" title="暂无条目" icon={false} />}
      />
    </Stack>
  )
}
