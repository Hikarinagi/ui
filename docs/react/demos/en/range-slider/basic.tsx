'use client'

import { useState } from 'react'
import { RangeSlider, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [year, setYear] = useState<[number, number]>([2010, 2020])

  return (
    <Stack gap="sm" className="w-64">
      <RangeSlider value={year} onValueChange={setYear} min={1990} max={2026} aria-label="Years" />
      <Text size="sm" tone="muted">
        Value: {year[0]} to {year[1]}
      </Text>
    </Stack>
  )
}
