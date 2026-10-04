'use client'

import { useState } from 'react'
import { Slider, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [value, setValue] = useState<number | undefined>(20)
  const [committed, setCommitted] = useState(20)

  return (
    <Stack gap="sm" className="w-64">
      <Slider
        value={value}
        onValueChange={setValue}
        aria-label="Threshold"
        onCommit={setCommitted}
      />
      <Text size="sm" tone="muted">
        While dragging: {value}, on release: {committed}
      </Text>
    </Stack>
  )
}
