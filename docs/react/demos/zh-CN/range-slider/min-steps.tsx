'use client'

import { useState } from 'react'
import { RangeSlider, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [hours, setHours] = useState<[number, number]>([9, 18])

  return (
    <Stack gap="sm" className="w-64">
      <RangeSlider
        value={hours}
        onValueChange={setHours}
        max={24}
        minSteps={4}
        label="always"
        aria-label="营业时间"
      />
      <Text size="sm" tone="muted">
        两个拇指之间至少相隔四步
      </Text>
    </Stack>
  )
}
