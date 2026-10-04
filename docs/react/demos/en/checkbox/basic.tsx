'use client'

import { useState } from 'react'
import { Checkbox, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [remember, setRemember] = useState<boolean | 'indeterminate'>(false)

  return (
    <Stack gap="sm">
      <Checkbox checked={remember} onCheckedChange={setRemember}>
        Keep me signed in
      </Checkbox>
      <Text size="sm" tone="muted">
        Value: {String(remember)}
      </Text>
    </Stack>
  )
}
