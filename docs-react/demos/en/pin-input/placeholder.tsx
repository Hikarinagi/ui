'use client'

import { useState } from 'react'
import { PinInput } from '@hina-ui/react'

export default function Demo() {
  const [code, setCode] = useState('')

  return (
    <PinInput value={code} onValueChange={setCode} placeholder="○" aria-label="Verification code" />
  )
}
