'use client'

import { useState } from 'react'
import { DateTimePicker, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [at, setAt] = useState<string | null>(null)
  return (
    <Stack gap="sm" align="start">
      <DateTimePicker
        value={at}
        onValueChange={setAt}
        placeholder="2026-09-01T09:00"
        aria-label="Schedule"
        className="w-80"
      />
      <Text tone="muted" size="sm">
        Value: {at ?? 'empty'}
      </Text>
    </Stack>
  )
}
