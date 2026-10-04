'use client'

import { useState } from 'react'
import { CheckboxGroup, Stack, Text } from '@hina-ui/react'

const options = [
  { value: 'mail', label: 'Email' },
  { value: 'push', label: 'Push notification' },
  { value: 'sms', label: 'SMS' },
]

export default function Demo() {
  const [channels, setChannels] = useState<Array<string | number>>(['mail'])

  return (
    <Stack gap="sm">
      <CheckboxGroup
        value={channels}
        onValueChange={setChannels}
        options={options}
        aria-label="Notification channels"
      />
      <Text size="sm" tone="muted">
        Value: {JSON.stringify(channels, null, 2)}
      </Text>
    </Stack>
  )
}
