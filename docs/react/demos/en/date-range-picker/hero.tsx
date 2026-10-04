'use client'

import { useState } from 'react'
import { DateRangePicker, Stack, Text, type DateRangeValue } from '@hina-ui/react'

export default function Demo() {
  const [range, setRange] = useState<DateRangeValue | null>({
    start: '2026-09-04',
    end: '2026-09-12',
  })
  return (
    <Stack gap="sm" align="start">
      <DateRangePicker
        value={range}
        onValueChange={setRange}
        clearable
        aria-label="Event period"
        className="w-96"
      />
      <Text tone="muted" size="sm">
        Value: {range ? `${range.start ?? 'empty'} to ${range.end ?? 'empty'}` : 'empty'}
      </Text>
    </Stack>
  )
}
