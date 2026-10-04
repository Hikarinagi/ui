'use client'

import { useState } from 'react'
import { Button, Popconfirm, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [done, setDone] = useState(false)
  return (
    <Stack gap="sm" align="start">
      <Popconfirm title="把全部通知标记为已读？" onConfirm={() => setDone(true)}>
        <Button variant="outline" tone="neutral">
          全部已读
        </Button>
      </Popconfirm>
      {done ? (
        <Text tone="muted" size="sm">
          已全部标记为已读。
        </Text>
      ) : null}
    </Stack>
  )
}
