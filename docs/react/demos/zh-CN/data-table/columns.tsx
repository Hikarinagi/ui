'use client'

import { useMemo, useState } from 'react'
import { Checkbox, DataTable } from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const { rows, columns } = tableDemo('zh-CN')
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
      label="条目列表"
      renderToolbar={() => (
        <Checkbox checked={showCount} onCheckedChange={value => setShowCount(value === true)}>
          显示数量列
        </Checkbox>
      )}
    />
  )
}
