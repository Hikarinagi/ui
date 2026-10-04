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
        aria-label="活动期间"
        className="w-96"
        leading={<CalendarRange />}
      />
      <Text tone="muted" size="sm">
        值：{range ? `${range.start ?? '空'} 至 ${range.end ?? '空'}` : '空'}
      </Text>
    </Stack>
  )
}
