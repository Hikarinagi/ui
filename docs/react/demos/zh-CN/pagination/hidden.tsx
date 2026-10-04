'use client'

import { useState } from 'react'
import { Button, Pagination, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [total, setTotal] = useState(5)

  return (
    <Stack gap="sm">
      <Button
        variant="soft"
        tone="neutral"
        className="self-start"
        onClick={() => setTotal(value => (value === 5 ? 50 : 5))}
      >
        total: {total}
      </Button>
      <Pagination
        total={total}
        hideSinglePage
        renderList={() => (
          <Text size="sm" tone="muted">
            列表插槽始终保留。
          </Text>
        )}
      />
    </Stack>
  )
}
