'use client'

import { useState } from 'react'
import { Button, Inline, Skeleton, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [loading, setLoading] = useState(true)

  return (
    <Stack className="w-full max-w-sm">
      <Inline>
        <Skeleton loading={loading}>
          <Text>ATRI</Text>
        </Skeleton>
        <Skeleton loading={loading}>
          <Text tone="muted" size="sm">
            第 42 章
          </Text>
        </Skeleton>
      </Inline>
      <Button size="sm" variant="soft" tone="neutral" onClick={() => setLoading(!loading)}>
        {loading ? '加载完成' : '重新加载'}
      </Button>
    </Stack>
  )
}
