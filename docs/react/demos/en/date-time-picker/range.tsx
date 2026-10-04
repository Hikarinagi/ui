'use client'

import { useState } from 'react'
import { DateTimePicker } from '@hina-ui/react'

export default function Demo() {
  const [at, setAt] = useState<string | null>('2026-09-10T20:00')
  const weekend = (value: string) => [0, 6].includes(new Date(`${value}T00:00`).getDay())
  return (
    <DateTimePicker
      value={at}
      onValueChange={setAt}
      min="2026-09-01T00:00"
      max="2026-09-30T23:59"
      minuteStep={15}
      unavailable={weekend}
      aria-label="Event time"
      className="w-80"
    />
  )
}
