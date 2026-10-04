'use client'

import { useState } from 'react'
import { Button, QRCode, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [expired, setExpired] = useState(true)

  return (
    <Stack align="center" data-demo-qr-custom="">
      <QRCode
        value="https://hinaui.dev"
        status={expired ? 'expired' : 'active'}
        size={224}
        onRefresh={() => setExpired(false)}
        renderStatus={({ refresh }) => (
          <>
            <Text weight="medium">Share link expired</Text>
            <Text size="xs" tone="muted">
              Generate a fresh code to continue
            </Text>
            <Button size="sm" variant="outline" onClick={refresh}>
              Generate again
            </Button>
          </>
        )}
      />
      <Button variant="ghost" size="sm" disabled={expired} onClick={() => setExpired(true)}>
        Simulate expiry
      </Button>
    </Stack>
  )
}
