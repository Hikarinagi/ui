'use client'

import { useState } from 'react'
import { DateField, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [date, setDate] = useState<string | null>(null)
  return (
    <Stack gap="sm" align="start">
      <DateField value={date} onValueChange={setDate} aria-label="发售日期" className="w-72" />
      <Text tone="muted" size="sm">
        值：{date ?? '空'}
      </Text>
    </Stack>
  )
}
