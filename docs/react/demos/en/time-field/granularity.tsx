'use client'

import { useState } from 'react'
import { Stack, TimeField } from '@hina-ui/react'

export default function Demo() {
  const [hour, setHour] = useState<string | null>('20:00')
  const [second, setSecond] = useState<string | null>('20:00:30')
  const [twelve, setTwelve] = useState<string | null>('20:00')
  return (
    <Stack className="w-56">
      <TimeField value={hour} onValueChange={setHour} granularity="hour" aria-label="Whole hour" />
      <TimeField
        value={second}
        onValueChange={setSecond}
        granularity="second"
        aria-label="Seconds"
      />
      <TimeField
        value={twelve}
        onValueChange={setTwelve}
        hourCycle={12}
        aria-label="12-hour clock"
      />
    </Stack>
  )
}
