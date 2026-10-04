'use client'

import { useState } from 'react'
import { Button, Pagination, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [page, setPage] = useState(10)
  const [large, setLarge] = useState(false)

  return (
    <Stack gap="sm">
      <Pagination value={page} onValueChange={setPage} total={large ? 100000 : 250} />
      <Text size="sm" tone="muted">
        Current page: {page}
      </Text>
      <Button
        variant="soft"
        tone="neutral"
        className="self-start"
        onClick={() => setLarge(value => !value)}
      >
        {large ? '25 pages' : '10,000 pages'}
      </Button>
    </Stack>
  )
}
