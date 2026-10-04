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

const { rows, columns } = tableDemo('en')
const modes = [
  { value: 'fit', label: 'Keep table width' },
  { value: 'expand', label: 'Resize current column' },
]
const sizedColumns: DataTableColumn<TableDemoRow>[] = [
  { key: 'id', label: 'ID', width: 72, pin: 'start', reorderable: false },
  { ...columns[0]!, width: 220, minWidth: 120, maxWidth: 360, truncate: true },
  { ...columns[1]!, width: 180 },
  { ...columns[2]!, width: 140, pin: 'end', reorderable: false },
]
const longRows = rows
  .slice(0, 4)
  .map(row => ({ ...row, name: `${row.name} — A longer label that can be truncated` }))

export default function Demo() {
  const [mode, setMode] = useState<'fit' | 'expand'>('fit')
  const [order, setOrder] = useState<string[]>([])
  const [widths, setWidths] = useState<Record<string, number>>({})

  return (
    <Stack gap="sm" className="w-full">
      <Inline justify="between">
        <Inline gap="sm">
          <Text size="sm" tone="muted">
            Resize mode
          </Text>
          <Select
            value={mode}
            onValueChange={value => setMode(value as 'fit' | 'expand')}
            options={modes}
            size="sm"
            className="w-44"
            aria-label="Resize mode"
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
          Reset columns
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
        label="Entries"
      />
    </Stack>
  )
}
