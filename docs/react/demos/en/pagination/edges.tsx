'use client'

import { useState } from 'react'
import { Pagination, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [page, setPage] = useState(10)

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          sibling-count=&quot;1&quot;
        </Text>
        <Pagination value={page} onValueChange={setPage} total={200} />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          sibling-count=&quot;0&quot; + show-first-last
        </Text>
        <Pagination
          value={page}
          onValueChange={setPage}
          total={200}
          siblingCount={0}
          showFirstLast
        />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          show-edges=&quot;false&quot;
        </Text>
        <Pagination value={page} onValueChange={setPage} total={200} showEdges={false} />
      </Stack>
    </Stack>
  )
}
