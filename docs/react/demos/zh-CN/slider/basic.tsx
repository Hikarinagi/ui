'use client'

import { useState } from 'react'
import { Slider, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [brightness, setBrightness] = useState<number | undefined>(40)

  return (
    <Stack gap="sm" className="w-64">
      <Slider value={brightness} onValueChange={setBrightness} aria-label="亮度" />
      <Text size="sm" tone="muted">
        当前值：{brightness}
      </Text>
    </Stack>
  )
}
