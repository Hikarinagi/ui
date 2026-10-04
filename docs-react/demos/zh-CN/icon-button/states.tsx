'use client'

import { useState } from 'react'
import { RotateCw, Trash2 } from 'lucide-react'
import { IconButton, Inline } from '@hina-ui/react'

export default function Demo() {
  const [refreshing, setRefreshing] = useState(false)

  function refresh() {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }

  return (
    <Inline>
      <IconButton label="刷新" variant="outline" loading={refreshing} onClick={refresh}>
        <RotateCw />
      </IconButton>
      <IconButton label="删除" variant="outline" tone="danger" disabled>
        <Trash2 />
      </IconButton>
    </Inline>
  )
}
