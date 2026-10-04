'use client'

import { useState } from 'react'
import { Calendar } from '@hina-ui/react'

export default function Demo() {
  const [date, setDate] = useState<string | null>('2026-09-10')

  return <Calendar value={date} onValueChange={setDate} min="2026-09-07" max="2026-09-25" />
}
