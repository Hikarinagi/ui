'use client'

import { useState } from 'react'
import { Button, Inline, Pagination, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [page, setPage] = useState(18)
  const [total, setTotal] = useState(200)
  const [pageSize, setPageSize] = useState(10)

  return (
    <Stack gap="sm">
      <Inline gap="sm">
        <Button
          variant="soft"
          tone="neutral"
          onClick={() => setTotal(value => (value === 200 ? 45 : 200))}
        >
          total: {total}
        </Button>
        <Button
          variant="soft"
          tone="neutral"
          onClick={() => setPageSize(value => (value === 10 ? 25 : 10))}
        >
          page-size: {pageSize}
        </Button>
      </Inline>
      <Pagination value={page} onValueChange={setPage} total={total} pageSize={pageSize} />
      <Text size="sm" tone="muted">
        Page: {page}
      </Text>
    </Stack>
  )
}
