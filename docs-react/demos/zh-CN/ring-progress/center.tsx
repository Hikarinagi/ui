'use client'

import { Check } from 'lucide-react'
import { Inline, RingProgress } from '@hina-ui/react'

const format = (value: number, max: number) => `${value}/${max}`

export default function Demo() {
  return (
    <Inline gap="lg" align="center">
      <RingProgress value={100} tone="success">
        <Check className="text-success size-6" />
      </RingProgress>
      <RingProgress value={3} max={8} showValue format={format} />
    </Inline>
  )
}
