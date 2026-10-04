'use client'

import { useState } from 'react'
import { DateField } from '@hina-ui/react'

export default function Demo() {
  const [date, setDate] = useState<string | null>('2026-10-15')
  return (
    <DateField
      value={date}
      onValueChange={setDate}
      min="2026-09-01"
      max="2026-09-30"
      placeholder="2026-09-01"
      aria-label="Event date"
      className="w-72"
    />
  )
}
