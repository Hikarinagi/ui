'use client'

import { useState } from 'react'
import { RangeSlider, Stack } from '@hina-ui/react'

export default function Demo() {
  const [discount, setDiscount] = useState<[number, number]>([20, 60])
  const [hidden, setHidden] = useState<[number, number]>([30, 70])

  return (
    <Stack gap="lg" className="w-64 pt-6">
      <RangeSlider
        value={discount}
        onValueChange={setDiscount}
        label="always"
        format={(v: number) => `${v}%`}
        aria-label="Discount range"
      />
      <RangeSlider value={hidden} onValueChange={setHidden} label="none" aria-label="No label" />
    </Stack>
  )
}
