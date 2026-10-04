'use client'

import { useState } from 'react'
import { CalendarRange } from 'lucide-react'
import { DateRangeField, Stack, Text, type DateRangeValue } from '@hina-ui/react'

export default function Demo() {
  const [range, setRange] = useState<DateRangeValue | null>({
    start: '2026-09-01',
    end: '2026-09-30',
  })
  return (
    <Stack gap="sm" align="start">
      <DateRangeField
        value={range}
        onValueChange={setRange}
        clearable
        aria-label="Event period"
        className="w-96"
        leading={<CalendarRange />}
      />
      <Text tone="muted" size="sm">
        Value: {range ? `${range.start ?? 'empty'} to ${range.end ?? 'empty'}` : 'empty'}
      </Text>
    </Stack>
  )
}
