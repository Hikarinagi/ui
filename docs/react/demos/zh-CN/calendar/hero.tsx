'use client'

import { useState } from 'react'
import { Calendar, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [date, setDate] = useState<string | null>('2026-09-04')

  return (
    <Stack gap="sm" align="start">
      <Calendar value={date} onValueChange={setDate} />
      <Text tone="muted" size="sm">
        值：{date ?? '空'}
      </Text>
    </Stack>
  )
}
