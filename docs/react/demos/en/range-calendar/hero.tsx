'use client'

import { useState } from 'react'
import { RangeCalendar, Stack, Text, type DateRangeValue } from '@hina-ui/react'

export default function Demo() {
  const [range, setRange] = useState<DateRangeValue | null>({
    start: '2026-09-04',
    end: '2026-09-12',
  })

  return (
    <Stack gap="sm" align="start">
      <RangeCalendar value={range} onValueChange={setRange} />
      <Text tone="muted" size="sm">
        Value: {range ? `${range.start ?? 'empty'} to ${range.end ?? 'empty'}` : 'empty'}
      </Text>
    </Stack>
  )
}
