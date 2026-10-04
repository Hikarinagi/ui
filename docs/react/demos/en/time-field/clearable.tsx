'use client'

import { useState } from 'react'
import { TimeField } from '@hina-ui/react'

export default function Demo() {
  const [time, setTime] = useState<string | null>('20:00')
  return (
    <TimeField
      value={time}
      onValueChange={setTime}
      clearable
      aria-label="Stream start"
      className="w-40"
    />
  )
}
