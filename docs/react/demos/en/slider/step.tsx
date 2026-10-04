'use client'

import { useState } from 'react'
import { Slider } from '@hina-ui/react'

export default function Demo() {
  const [rating, setRating] = useState<number | undefined>(3.5)

  return (
    <Slider
      value={rating}
      onValueChange={setRating}
      min={1}
      max={5}
      step={0.5}
      aria-label="Rating"
      className="w-64"
    />
  )
}
