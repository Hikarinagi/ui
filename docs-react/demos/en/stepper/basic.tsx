'use client'

import { useState } from 'react'
import { Stepper, Text, Stack } from '@hina-ui/react'

const items = [
  { title: 'Step A', description: 'The first description' },
  { title: 'Step B', description: 'A longer description that wraps naturally across lines' },
  { title: 'Step C', description: 'The final description' },
]

export default function Demo() {
  const [step, setStep] = useState(1)
  return (
    <Stack className="w-full" gap="lg">
      <Stepper value={step} onValueChange={setStep} items={items} />
      <Text size="sm" tone="muted">
        Current step：{step}
      </Text>
    </Stack>
  )
}
