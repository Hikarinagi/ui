'use client'

import { useState } from 'react'
import { RangeCalendar, Stack, Text, type DateRangeValue } from '@hina-ui/react'

export default function Demo() {
  const [range, setRange] = useState<DateRangeValue | null>(null)

  return (
    <Stack gap="sm" align="start">
      <RangeCalendar value={range} onValueChange={setRange} placeholder="2026-09-01" />
      <Text tone="muted" size="sm">
        值：{range ? `${range.start ?? '空'} 至 ${range.end ?? '空'}` : '空'}
      </Text>
    </Stack>
  )
}
