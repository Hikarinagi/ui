'use client'

import { useState } from 'react'
import { Stack, Switch, Text } from '@hina-ui/react'

export default function Demo() {
  const [nsfw, setNsfw] = useState(false)

  return (
    <Stack gap="sm">
      <Switch checked={nsfw} onCheckedChange={setNsfw}>
        显示限制级内容
      </Switch>
      <Text size="sm" tone="muted">
        当前值：{String(nsfw)}
      </Text>
    </Stack>
  )
}
