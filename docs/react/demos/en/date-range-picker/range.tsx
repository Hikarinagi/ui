'use client'

import { useState } from 'react'
import { DateRangePicker, type DateRangeValue } from '@hina-ui/react'

export default function Demo() {
  const [range, setRange] = useState<DateRangeValue | null>({
    start: '2026-09-08',
    end: '2026-09-11',
  })
  const weekend = (value: string) => [0, 6].includes(new Date(`${value}T00:00`).getDay())
  return (
    <DateRangePicker
      value={range}
      onValueChange={setRange}
      min="2026-09-01"
      max="2026-09-30"
      maximumDays={7}
      unavailable={weekend}
      aria-label="Event period"
      className="w-96"
    />
  )
}
