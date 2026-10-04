'use client'

import { Avatar, DataTable, Inline, Progress, Stack, Tag, Text } from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const { rows, columns, statusLabels } = tableDemo('en')
const entries = rows.slice(0, 5)

export default function Demo() {
  return (
    <DataTable
      rows={entries}
      columns={columns}
      rowKey="id"
      label="Entries"
      renderCell={({ row, column, value }) => {
        if (column.key === 'name')
          return (
            <Inline gap="sm" wrap={false} className="min-w-36 py-2">
              <Avatar name={row.name.slice(-1)} size="sm" aria-hidden="true" />
              <Stack gap="none">
                <Text size="sm" weight="medium" className="whitespace-nowrap">
                  {row.name}
                </Text>
                <Text size="xs" tone="muted">
                  ID {row.id}
                </Text>
              </Stack>
            </Inline>
          )
        if (column.key === 'status')
          return (
            <Tag tone={row.status === 'active' ? 'success' : 'neutral'}>
              {statusLabels[row.status]}
            </Tag>
          )
        if (column.key === 'count')
          return (
            <Inline gap="sm" wrap={false} className="min-w-32">
              <Progress
                value={Number(value)}
                max={150}
                aria-label={column.label}
                size="sm"
                className="flex-1"
              />
              <Text size="sm" className="w-8 shrink-0 text-end tabular-nums">
                {String(value)}
              </Text>
            </Inline>
          )
        return String(value)
      }}
    />
  )
}
