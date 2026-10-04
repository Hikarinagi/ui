'use client'

import { useState } from 'react'
import { SegmentedControl } from '@hina-ui/react'

const options = [
  { value: 'left', label: '左对齐' },
  { value: 'center', label: '居中' },
  { value: 'right', label: '右对齐' },
]

export default function Demo() {
  const [align, setAlign] = useState<string | number>('left')

  return (
    <SegmentedControl
      value={align}
      onValueChange={setAlign}
      options={options}
      orientation="vertical"
      aria-label="对齐"
    />
  )
}
