'use client'

import { useState } from 'react'
import { DateRangeField, Stack, Text, type DateRangeValue } from '@hina-ui/react'

export default function Demo() {
  const [range, setRange] = useState<DateRangeValue | null>(null)
  return (
    <Stack gap="sm" align="start">
      <DateRangeField
        value={range}
        onValueChange={setRange}
        aria-label="发售期间"
        className="w-96"
      />
      <Text tone="muted" size="sm">
        值：{range ? `${range.start ?? '空'} 至 ${range.end ?? '空'}` : '空'}
      </Text>
    </Stack>
  )
}
