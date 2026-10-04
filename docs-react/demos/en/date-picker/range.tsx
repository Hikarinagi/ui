'use client'

import { useState } from 'react'
import { DatePicker } from '@hina-ui/react'

export default function Demo() {
  const [date, setDate] = useState<string | null>('2026-09-10')
  const weekend = (value: string) => [0, 6].includes(new Date(`${value}T00:00`).getDay())
  return (
    <DatePicker
      value={date}
      onValueChange={setDate}
      min="2026-09-01"
      max="2026-09-30"
      unavailable={weekend}
      aria-label="Event date"
      className="w-72"
    />
  )
}
