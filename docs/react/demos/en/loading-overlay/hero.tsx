'use client'

import { useState } from 'react'
import { Button, Card, LoadingOverlay, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [loading, setLoading] = useState(false)

  async function reload() {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1800))
    setLoading(false)
  }

  return (
    <Stack gap="sm" align="start">
      <Card className="relative w-96">
        <Stack gap="xs">
          <Text weight="medium">This week</Text>
          <Text tone="muted" size="sm">
            128 bookmarks, 32 comments, 12 new followers.
          </Text>
        </Stack>
        <LoadingOverlay visible={loading} text="Refreshing" />
      </Card>
      <Button variant="outline" tone="neutral" disabled={loading} onClick={reload}>
        Refresh
      </Button>
    </Stack>
  )
}
