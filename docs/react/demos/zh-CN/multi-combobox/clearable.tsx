'use client'

import { useState } from 'react'
import { MultiCombobox } from '@hina-ui/react'

const options = [
  { value: 1, label: 'Key' },
  { value: 2, label: 'Type-Moon' },
  { value: 3, label: 'Nitroplus' },
]

export default function Demo() {
  const [studios, setStudios] = useState<Array<string | number>>([1, 2])

  return (
    <MultiCombobox
      value={studios}
      onValueChange={setStudios}
      options={options}
      clearable
      aria-label="制作公司"
      className="w-80"
    />
  )
}
