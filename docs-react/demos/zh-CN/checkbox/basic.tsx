'use client'

import { useState } from 'react'
import { Checkbox, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [remember, setRemember] = useState<boolean | 'indeterminate'>(false)

  return (
    <Stack gap="sm">
      <Checkbox checked={remember} onCheckedChange={setRemember}>
        记住登录状态
      </Checkbox>
      <Text size="sm" tone="muted">
        当前值：{String(remember)}
      </Text>
    </Stack>
  )
}
