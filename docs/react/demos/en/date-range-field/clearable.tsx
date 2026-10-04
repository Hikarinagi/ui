'use client'

import { useState } from 'react'
import { DateRangeField, type DateRangeValue } from '@hina-ui/react'

export default function Demo() {
  const [range, setRange] = useState<DateRangeValue | null>({
    start: '2026-09-01',
    end: '2026-09-30',
  })
  return (
    <DateRangeField
      value={range}
      onValueChange={setRange}
      clearable
      aria-label="Event period"
      className="w-96"
    />
  )
}
