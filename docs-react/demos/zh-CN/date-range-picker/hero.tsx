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
        aria-label="活动期间"
        className="w-96"
      />
      <Text tone="muted" size="sm">
        值：{range ? `${range.start ?? '空'} 至 ${range.end ?? '空'}` : '空'}
      </Text>
    </Stack>
  )
}
