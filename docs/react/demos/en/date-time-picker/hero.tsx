'use client'

import { useState } from 'react'
import { DateTimePicker, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [at, setAt] = useState<string | null>('2026-09-04T20:00')
  return (
    <Stack gap="sm" align="start">
      <DateTimePicker
        value={at}
        onValueChange={setAt}
        clearable
        aria-label="Publish time"
        className="w-80"
      />
      <Text tone="muted" size="sm">
        Value: {at ?? 'empty'}
      </Text>
    </Stack>
  )
}
