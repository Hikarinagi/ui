'use client'

import { useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { DateField, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [date, setDate] = useState<string | null>('2026-09-04')
  return (
    <Stack gap="sm" align="start">
      <DateField
        value={date}
        onValueChange={setDate}
        clearable
        aria-label="Publish date"
        className="w-72"
        leading={<CalendarDays />}
      />
      <Text tone="muted" size="sm">
        Value: {date ?? 'empty'}
      </Text>
    </Stack>
  )
}
