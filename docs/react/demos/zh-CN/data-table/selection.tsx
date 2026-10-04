'use client'

import { useState } from 'react'
import { Button, DataTable, Inline, Text, type DataTableKey } from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const { rows, columns } = tableDemo('zh-CN')

export default function Demo() {
  const [selected, setSelected] = useState<DataTableKey[]>([1])

  return (
    <DataTable
      selected={selected}
      onSelectedChange={setSelected}
      rows={rows}
      columns={columns}
      rowKey="id"
      rowLabel="name"
      selectable={row => row.status !== 'archived'}
      pagination
      defaultPageSize={5}
      label="条目列表"
      renderToolbar={() => (
        <Inline align="center" justify="between">
          <Text size="sm" tone="muted">
            已选：{selected.length}
          </Text>
          <Button
            variant="ghost"
            tone="neutral"
            size="sm"
            disabled={!selected.length}
            onClick={() => setSelected([])}
          >
            清空选择
          </Button>
        </Inline>
      )}
    />
  )
}
