'use client'

import { useState } from 'react'
import { Pagination, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [page, setPage] = useState(3)

  return (
    <Stack gap="lg">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <Stack key={size} gap="xs">
          <Text size="sm" tone="muted">
            {size}
          </Text>
          <Pagination value={page} onValueChange={setPage} total={50} size={size} />
        </Stack>
      ))}
    </Stack>
  )
}
