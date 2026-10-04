'use client'

import { useState } from 'react'
import { Pagination, Stack, Text, type PaginationChange } from '@hina-ui/react'

export default function Demo() {
  const [page, setPage] = useState(8)
  const [pageSize, setPageSize] = useState(10)
  const [lastChange, setLastChange] = useState<PaginationChange>()

  return (
    <Stack gap="sm">
      <Pagination
        value={page}
        onValueChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        total={246}
        pageSizeOptions={[10, 20, 50]}
        showInfo
        showJump
        onChange={setLastChange}
      />
      <Text size="sm" tone="muted">
        change: {lastChange ? JSON.stringify(lastChange, null, 2) : '—'}
      </Text>
    </Stack>
  )
}
