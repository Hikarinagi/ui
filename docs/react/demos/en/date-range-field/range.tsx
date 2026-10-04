'use client'

import { useState } from 'react'
import { DateRangeField, type DateRangeValue } from '@hina-ui/react'

export default function Demo() {
  const [range, setRange] = useState<DateRangeValue | null>({
    start: '2026-09-20',
    end: '2026-09-10',
  })
  return (
    <DateRangeField
      value={range}
      onValueChange={setRange}
      min="2026-09-01"
      max="2026-09-30"
      placeholder="2026-09-01"
      aria-label="Event period"
      className="w-96"
    />
  )
}
