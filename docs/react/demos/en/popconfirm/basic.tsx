'use client'

import { useState } from 'react'
import { Button, Popconfirm, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [done, setDone] = useState(false)
  return (
    <Stack gap="sm" align="start">
      <Popconfirm title="Mark every notification as read?" onConfirm={() => setDone(true)}>
        <Button variant="outline" tone="neutral">
          Mark all as read
        </Button>
      </Popconfirm>
      {done ? (
        <Text tone="muted" size="sm">
          Everything was marked as read.
        </Text>
      ) : null}
    </Stack>
  )
}
