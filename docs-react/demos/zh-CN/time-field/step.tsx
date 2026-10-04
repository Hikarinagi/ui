'use client'

import { useState } from 'react'
import { Stack, Text, TimeField } from '@hina-ui/react'

export default function Demo() {
  const [time, setTime] = useState<string | null>('09:00')
  return (
    <Stack gap="sm" align="start">
      <TimeField
        value={time}
        onValueChange={setTime}
        minuteStep={15}
        aria-label="预约时段"
        className="w-40"
      />
      <Text tone="muted" size="sm">
        值：{time ?? '空'}
      </Text>
    </Stack>
  )
}
