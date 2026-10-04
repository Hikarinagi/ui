'use client'

import { useState } from 'react'
import { Button, DataTable, Empty, Stack } from '@hina-ui/react'
import { tableDemo, type TableDemoRow } from '../../data-table'

const { rows, columns } = tableDemo('en')
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
        Toggle loading
      </Button>
      <DataTable rows={entries} columns={columns} rowKey="id" loading={loading} label="Entries" />
      <DataTable
        rows={noRows}
        columns={columns}
        rowKey="id"
        label="Entries"
        empty={<Empty size="sm" title="No entries" icon={false} />}
      />
    </Stack>
  )
}
