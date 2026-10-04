'use client'

import { useState } from 'react'
import { Pagination, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [page, setPage] = useState(3)

  return (
    <Stack gap="lg">
      {(['ltr', 'rtl'] as const).map(dir => (
        <Stack key={dir} gap="xs">
          <Text size="sm" tone="muted">
            {dir.toUpperCase()}
          </Text>
          <Pagination value={page} onValueChange={setPage} total={50} dir={dir} />
        </Stack>
      ))}
    </Stack>
  )
}
