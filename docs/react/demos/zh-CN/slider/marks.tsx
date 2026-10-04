'use client'

import { useState } from 'react'
import { Slider } from '@hina-ui/react'

const marks = [
  { value: 0, label: '慢' },
  { value: 25 },
  { value: 50, label: '中' },
  { value: 75 },
  { value: 100, label: '快' },
]

export default function Demo() {
  const [speed, setSpeed] = useState<number | undefined>(50)

  return (
    <Slider
      value={speed}
      onValueChange={setSpeed}
      step={25}
      marks={marks}
      aria-label="翻页速度"
      className="w-64"
    />
  )
}
