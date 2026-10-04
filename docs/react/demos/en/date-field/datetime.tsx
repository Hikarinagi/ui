'use client'

import { useState } from 'react'
import { DateField, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [at, setAt] = useState<string | null>('2026-09-04T20:00')
  return (
    <Stack gap="sm" align="start">
      <DateField
        value={at}
        onValueChange={setAt}
        granularity="minute"
        aria-label="Schedule"
        className="w-80"
      />
      <Text tone="muted" size="sm">
        Value: {at ?? 'empty'}
      </Text>
    </Stack>
  )
}
