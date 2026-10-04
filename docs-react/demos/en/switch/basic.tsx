'use client'

import { useState } from 'react'
import { Stack, Switch, Text } from '@hina-ui/react'

export default function Demo() {
  const [nsfw, setNsfw] = useState(false)

  return (
    <Stack gap="sm">
      <Switch checked={nsfw} onCheckedChange={setNsfw}>
        Show mature content
      </Switch>
      <Text size="sm" tone="muted">
        Value: {String(nsfw)}
      </Text>
    </Stack>
  )
}
