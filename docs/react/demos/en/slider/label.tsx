'use client'

import { useState } from 'react'
import { Slider, Stack } from '@hina-ui/react'

export default function Demo() {
  const [quality, setQuality] = useState<number | undefined>(80)
  const [opacity, setOpacity] = useState<number | undefined>(30)

  return (
    <Stack gap="lg" className="w-64 pt-6">
      <Slider
        value={quality}
        onValueChange={setQuality}
        label="always"
        format={(v: number) => `${v}%`}
        aria-label="Image quality"
      />
      <Slider
        value={opacity}
        onValueChange={setOpacity}
        label="none"
        aria-label="Overlay opacity"
      />
    </Stack>
  )
}
