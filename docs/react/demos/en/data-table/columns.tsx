'use client'

import { useMemo, useState } from 'react'
import { Checkbox, DataTable } from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const { rows, columns } = tableDemo('en')
const entries = rows.slice(0, 4)

export default function Demo() {
  const [showCount, setShowCount] = useState(true)
  const hiddenColumns = useMemo(() => (showCount ? [] : ['count']), [showCount])

  return (
    <DataTable
      rows={entries}
      columns={columns}
      hiddenColumns={hiddenColumns}
      rowKey="id"
      label="Entries"
      renderToolbar={() => (
        <Checkbox checked={showCount} onCheckedChange={value => setShowCount(value === true)}>
          Show count column
        </Checkbox>
      )}
    />
  )
}
