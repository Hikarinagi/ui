'use client'

import { useState } from 'react'
import { DateRangePicker, Stack, Text, type DateRangeValue } from '@hina-ui/react'

export default function Demo() {
  const [range, setRange] = useState<DateRangeValue | null>(null)
  return (
    <Stack gap="sm" align="start">
      <DateRangePicker
        value={range}
        onValueChange={setRange}
        aria-label="Release window"
        className="w-96"
      />
      <Text tone="muted" size="sm">
        Value: {range ? `${range.start ?? 'empty'} to ${range.end ?? 'empty'}` : 'empty'}
      </Text>
    </Stack>
  )
}
