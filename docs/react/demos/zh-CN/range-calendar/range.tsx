'use client'

import { useState } from 'react'
import { RangeCalendar, type DateRangeValue } from '@hina-ui/react'

export default function Demo() {
  const [range, setRange] = useState<DateRangeValue | null>({
    start: '2026-09-10',
    end: '2026-09-14',
  })

  return (
    <RangeCalendar
      value={range}
      onValueChange={setRange}
      min="2026-09-07"
      max="2026-09-25"
      maximumDays={7}
    />
  )
}
