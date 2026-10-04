'use client'

import { useState } from 'react'
import { Calendar, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [date, setDate] = useState<string | null>(null)

  return (
    <Stack gap="sm" align="start">
      <Calendar value={date} onValueChange={setDate} placeholder="2026-09-01" />
      <Text tone="muted" size="sm">
        值：{date ?? '空'}
      </Text>
    </Stack>
  )
}
