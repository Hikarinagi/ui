'use client'

import { useState } from 'react'
import { RangeCalendar, type DateRangeValue } from '@hina-ui/react'

const weekend = (value: string) => [0, 6].includes(new Date(`${value}T00:00`).getDay())

export default function Demo() {
  const [range, setRange] = useState<DateRangeValue | null>({
    start: '2026-09-07',
    end: '2026-09-11',
  })

  return <RangeCalendar value={range} onValueChange={setRange} unavailable={weekend} />
}
