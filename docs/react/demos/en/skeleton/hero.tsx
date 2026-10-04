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
            <Avatar size="lg" src="/avatars/selfie.webp" alt="Shion Hoshimi" />
          </Skeleton>
          <Stack gap="xs" className="min-w-0 flex-1">
            <Skeleton loading={loading}>
              <Text className="font-medium">Shion Hoshimi</Text>
            </Skeleton>
            <Skeleton loading={loading}>
              <Text tone="muted" size="sm">
                Translated 128 light novels
              </Text>
            </Skeleton>
          </Stack>
        </Inline>
      </Card>
      <Button size="sm" variant="soft" tone="neutral" onClick={() => setLoading(!loading)}>
        {loading ? 'Show the content' : 'Show the skeleton'}
      </Button>
    </Stack>
  )
}
