'use client'

import { useState } from 'react'
import { TimeField } from '@hina-ui/react'

export default function Demo() {
  const [time, setTime] = useState<string | null>('21:30')
  return (
    <TimeField
      value={time}
      onValueChange={setTime}
      min="09:00"
      max="18:00"
      placeholder="09:00"
      aria-label="Opening hours"
      className="w-40"
    />
  )
}
