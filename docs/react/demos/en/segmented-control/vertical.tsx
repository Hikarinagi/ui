'use client'

import { useState } from 'react'
import { SegmentedControl } from '@hina-ui/react'

const options = [
  { value: 'left', label: 'Align left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Align right' },
]

export default function Demo() {
  const [align, setAlign] = useState<string | number>('left')

  return (
    <SegmentedControl
      value={align}
      onValueChange={setAlign}
      options={options}
      orientation="vertical"
      aria-label="Alignment"
    />
  )
}
