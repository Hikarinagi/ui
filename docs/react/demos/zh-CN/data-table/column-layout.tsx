'use client'

import { useState } from 'react'
import {
  DataTable,
  Stack,
  Inline,
  Text,
  Select,
  Button,
  type DataTableColumn,
} from '@hina-ui/react'
import { tableDemo, type TableDemoRow } from '../../data-table'

const { rows, columns } = tableDemo('zh-CN')
const modes = [
  { value: 'fit', label: '保持总宽' },
  { value: 'expand', label: '仅调整当前列' },
]
const sizedColumns: DataTableColumn<TableDemoRow>[] = [
  { key: 'id', label: 'ID', width: 72, pin: 'start', reorderable: false },
  { ...columns[0]!, width: 220, minWidth: 120, maxWidth: 360, truncate: true },
  { ...columns[1]!, width: 180 },
  { ...columns[2]!, width: 140, pin: 'end', reorderable: false },
]
const longRows = rows
  .slice(0, 4)
  .map(row => ({ ...row, name: `${row.name} — 这是一段会随列宽变化而截断的名称` }))

export default function Demo() {
  const [mode, setMode] = useState<'fit' | 'expand'>('fit')
  const [order, setOrder] = useState<string[]>([])
  const [widths, setWidths] = useState<Record<string, number>>({})

  return (
    <Stack gap="sm" className="w-full">
      <Inline justify="between">
        <Inline gap="sm">
          <Text size="sm" tone="muted">
            调宽模式
          </Text>
          <Select
            value={mode}
            onValueChange={value => setMode(value as 'fit' | 'expand')}
            options={modes}
            size="sm"
            className="w-44"
            aria-label="调宽模式"
          />
        </Inline>
        <Button
          size="sm"
          variant="ghost"
          tone="neutral"
          disabled={!order.length && !Object.keys(widths).length}
          onClick={() => {
            setOrder([])
            setWidths({})
          }}
        >
          恢复列布局
        </Button>
      </Inline>
      <DataTable
        columnOrder={order}
        onColumnOrderChange={setOrder}
        columnWidths={widths}
        onColumnWidthsChange={setWidths}
        rows={longRows}
        columns={sizedColumns}
        rowKey="id"
        resizable
        resizeMode={mode}
        reorderColumns
        label="条目列表"
      />
    </Stack>
  )
}
