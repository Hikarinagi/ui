'use client'

import { useState } from 'react'
import { Button, Inline, RingProgress, Stack } from '@hina-ui/react'

export default function Demo() {
  const [value, setValue] = useState(30)
  const step = (delta: number) => {
    setValue(current => Math.min(100, Math.max(0, current + delta)))
  }
  return (
    <Stack gap="md" align="center">
      <RingProgress value={value} showValue size="lg" />
      <Inline gap="sm">
        <Button
          size="sm"
          variant="soft"
          tone="neutral"
          disabled={value === 0}
          onClick={() => step(-10)}
        >
          减 10
        </Button>
        <Button
          size="sm"
          variant="soft"
          tone="neutral"
          disabled={value === 100}
          onClick={() => step(10)}
        >
          加 10
        </Button>
      </Inline>
    </Stack>
  )
}
