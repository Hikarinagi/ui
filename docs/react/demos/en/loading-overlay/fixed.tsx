'use client'

import { useState } from 'react'
import { Button, Image, LoadingOverlay, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [loading, setLoading] = useState(false)

  async function reload() {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
  }

  return (
    <>
      <Button variant="outline" tone="neutral" onClick={reload}>
        Cover the page for two seconds
      </Button>
      <LoadingOverlay visible={loading} fixed>
        <Stack gap="xs" align="center" role="status">
          <Image
            src="/mascot/run.gif"
            alt="Hoshimi Shion running over with a book"
            ratio={1}
            fit="contain"
            skeleton={false}
            eager
            lazy={false}
            className="size-32"
          />
          <Text size="sm" tone="muted">
            Switching account
          </Text>
        </Stack>
      </LoadingOverlay>
    </>
  )
}
