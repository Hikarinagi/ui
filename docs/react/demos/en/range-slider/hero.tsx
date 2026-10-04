'use client'

import { useState } from 'react'
import { RangeSlider } from '@hina-ui/react'

export default function Demo() {
  const [price, setPrice] = useState<[number, number]>([120, 480])

  return (
    <RangeSlider
      value={price}
      onValueChange={setPrice}
      max={1000}
      step={10}
      aria-label="Price range"
      className="w-64"
    />
  )
}
