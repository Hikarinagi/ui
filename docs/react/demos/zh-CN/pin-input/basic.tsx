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
        aria-label="邀请码"
        onComplete={setSubmitted}
      />
      <Text tone="muted" size="sm">
        {submitted ? `已填满：${submitted}` : `当前：${code || '空'}`}
      </Text>
    </Stack>
  )
}
