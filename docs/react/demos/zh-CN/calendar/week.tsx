'use client'

import { useState } from 'react'
import { Calendar } from '@hina-ui/react'

export default function Demo() {
  const [date, setDate] = useState<string | null>('2026-09-04')

  return <Calendar value={date} onValueChange={setDate} weekStartsOn={0} weekdayFormat="short" />
}
