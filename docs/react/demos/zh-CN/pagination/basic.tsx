'use client'

import { useState } from 'react'
import { Pagination, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [page, setPage] = useState(1)

  return (
    <Stack gap="sm">
      <Pagination value={page} onValueChange={setPage} total={95} pageSize={10} />
      <Text size="sm" tone="muted">
        当前页：{page} / 10
      </Text>
    </Stack>
  )
}
