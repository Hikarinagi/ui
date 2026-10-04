'use client'

import { useState } from 'react'
import { DateField } from '@hina-ui/react'

export default function Demo() {
  const [date, setDate] = useState<string | null>('2026-09-04')
  return (
    <DateField
      value={date}
      onValueChange={setDate}
      clearable
      aria-label="发布日期"
      className="w-72"
    />
  )
}
