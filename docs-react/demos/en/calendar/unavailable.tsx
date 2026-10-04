'use client'

import { useState } from 'react'
import { Calendar } from '@hina-ui/react'

const weekend = (value: string) => [0, 6].includes(new Date(`${value}T00:00`).getDay())

export default function Demo() {
  const [date, setDate] = useState<string | null>('2026-09-04')

  return <Calendar value={date} onValueChange={setDate} unavailable={weekend} />
}
