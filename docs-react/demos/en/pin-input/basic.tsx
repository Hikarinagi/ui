'use client'

import { useState } from 'react'
import { PinInput, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [code, setCode] = useState('')
  const [submitted, setSubmitted] = useState('')

  return (
    <Stack gap="sm" align="start">
      <PinInput
        value={code}
        onValueChange={setCode}
        length={4}
        aria-label="Invite code"
        onComplete={setSubmitted}
      />
      <Text tone="muted" size="sm">
        {submitted ? `Completed: ${submitted}` : `Current: ${code || 'empty'}`}
      </Text>
    </Stack>
  )
}
