'use client'

import { useState } from 'react'
import { DateTimePicker } from '@hina-ui/react'

export default function Demo() {
  const [at, setAt] = useState<string | null>('2026-09-04T20:00')
  return (
    <DateTimePicker
      value={at}
      onValueChange={setAt}
      clearable
      aria-label="Publish time"
      className="w-80"
    />
  )
}
