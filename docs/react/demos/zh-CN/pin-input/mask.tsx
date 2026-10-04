'use client'

import { useState } from 'react'
import { PinInput } from '@hina-ui/react'

export default function Demo() {
  const [pin, setPin] = useState('')

  return (
    <PinInput
      value={pin}
      onValueChange={setPin}
      length={4}
      type="number"
      mask
      aria-label="PIN 码"
    />
  )
}
