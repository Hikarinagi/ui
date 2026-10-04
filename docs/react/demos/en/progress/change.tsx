'use client'

import { useState } from 'react'
import { Button, Inline, Progress, Stack } from '@hina-ui/react'

export default function Demo() {
  const [value, setValue] = useState(30)
  const step = (delta: number) => {
    setValue(Math.min(100, Math.max(0, value + delta)))
  }

  return (
    <Stack gap="md" className="w-80">
      <Progress value={value} label="Downloading" showValue />
      <Inline gap="sm">
        <Button
          size="sm"
          variant="soft"
          tone="neutral"
          disabled={value === 0}
          onClick={() => step(-10)}
        >
          −10
        </Button>
        <Button
          size="sm"
          variant="soft"
          tone="neutral"
          disabled={value === 100}
          onClick={() => step(10)}
        >
          +10
        </Button>
      </Inline>
    </Stack>
  )
}
