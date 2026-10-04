'use client'

import { useState } from 'react'
import { Stepper, Text, Stack } from '@hina-ui/react'

const items = [
  { title: '步骤 A', description: '第一项的说明' },
  { title: '步骤 B', description: '第二项包含更长的说明文字，支持自然换行' },
  { title: '步骤 C', description: '最后一项的说明' },
]

export default function Demo() {
  const [step, setStep] = useState(1)
  return (
    <Stack className="w-full" gap="lg">
      <Stepper value={step} onValueChange={setStep} items={items} />
      <Text size="sm" tone="muted">
        当前步骤：{step}
      </Text>
    </Stack>
  )
}
