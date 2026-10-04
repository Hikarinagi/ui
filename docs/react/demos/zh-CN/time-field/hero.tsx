'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'
import { Stack, Text, TimeField } from '@hina-ui/react'

export default function Demo() {
  const [time, setTime] = useState<string | null>('20:00')
  return (
    <Stack gap="sm" align="start">
      <TimeField
        value={time}
        onValueChange={setTime}
        clearable
        aria-label="开播时间"
        className="w-44"
        leading={<Clock />}
      />
      <Text tone="muted" size="sm">
        值：{time ?? '空'}
      </Text>
    </Stack>
  )
}
