'use client'

import { useState } from 'react'
import { CheckboxGroup, Stack, Text } from '@hina-ui/react'

const options = [
  { value: 'mail', label: '邮件' },
  { value: 'push', label: '站内推送' },
  { value: 'sms', label: '短信' },
]

export default function Demo() {
  const [channels, setChannels] = useState<Array<string | number>>(['mail'])

  return (
    <Stack gap="sm">
      <CheckboxGroup
        value={channels}
        onValueChange={setChannels}
        options={options}
        aria-label="通知方式"
      />
      <Text size="sm" tone="muted">
        当前值：{JSON.stringify(channels, null, 2)}
      </Text>
    </Stack>
  )
}
