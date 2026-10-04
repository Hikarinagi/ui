'use client'

import { useState } from 'react'
import { Slider } from '@hina-ui/react'

export default function Demo() {
  const [volume, setVolume] = useState<number | undefined>(60)

  return <Slider value={volume} onValueChange={setVolume} aria-label="音量" className="w-64" />
}
