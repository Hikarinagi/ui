'use client'

import { useState } from 'react'
import { RangeSlider } from '@hina-ui/react'

const marks = [
  { value: 0, label: '0' },
  { value: 25 },
  { value: 50, label: '50' },
  { value: 75 },
  { value: 100, label: '100' },
]

export default function Demo() {
  const [range, setRange] = useState<[number, number]>([25, 75])

  return (
    <RangeSlider
      value={range}
      onValueChange={setRange}
      step={25}
      marks={marks}
      aria-label="区间"
      className="w-64"
    />
  )
}
