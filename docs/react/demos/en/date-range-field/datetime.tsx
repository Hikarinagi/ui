'use client'

import { useState } from 'react'
import { DateRangeField, Stack, Text, type DateRangeValue } from '@hina-ui/react'

export default function Demo() {
  const [range, setRange] = useState<DateRangeValue | null>({
    start: '2026-09-04T19:00',
    end: '2026-09-04T21:30',
  })
  return (
    <Stack gap="sm" align="start">
      <DateRangeField
        value={range}
        onValueChange={setRange}
        granularity="minute"
        aria-label="Stream slot"
        className="w-[30rem]"
      />
      <Text tone="muted" size="sm">
        Value: {range ? `${range.start ?? 'empty'} to ${range.end ?? 'empty'}` : 'empty'}
      </Text>
    </Stack>
  )
}
