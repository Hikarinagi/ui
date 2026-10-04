'use client'

import { useState } from 'react'
import { Avatar, Button, Card, Inline, Skeleton, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [loading, setLoading] = useState(true)

  return (
    <Stack className="w-full max-w-sm">
      <Card>
        <Inline gap="sm" align="start">
          <Skeleton loading={loading} className="rounded-full">
            <Avatar size="lg" src="/avatars/selfie.webp" alt="星见书音" />
          </Skeleton>
          <Stack gap="xs" className="min-w-0 flex-1">
            <Skeleton loading={loading}>
              <Text className="font-medium">星见书音</Text>
            </Skeleton>
            <Skeleton loading={loading}>
              <Text tone="muted" size="sm">
                翻译了 128 本轻小说
              </Text>
            </Skeleton>
          </Stack>
        </Inline>
      </Card>
      <Button size="sm" variant="soft" tone="neutral" onClick={() => setLoading(!loading)}>
        {loading ? '显示内容' : '显示骨架'}
      </Button>
    </Stack>
  )
}
