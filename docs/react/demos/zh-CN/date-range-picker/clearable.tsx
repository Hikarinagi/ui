'use client'

import { useState } from 'react'
import { DateRangePicker, type DateRangeValue } from '@hina-ui/react'

export default function Demo() {
  const [range, setRange] = useState<DateRangeValue | null>({
    start: '2026-09-04',
    end: '2026-09-12',
  })
  return (
    <DateRangePicker
      value={range}
      onValueChange={setRange}
      clearable
      aria-label="活动期间"
      className="w-96"
    />
  )
}
