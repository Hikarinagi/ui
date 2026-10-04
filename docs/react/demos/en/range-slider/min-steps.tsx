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
        aria-label="Opening hours"
      />
      <Text size="sm" tone="muted">
        The thumbs stay at least four steps apart
      </Text>
    </Stack>
  )
}
