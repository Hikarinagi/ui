'use client'

import { useState } from 'react'
import { MultiCombobox } from '@hina-ui/react'

const options = [
  { value: 1, label: 'Key' },
  { value: 2, label: 'Type-Moon' },
  { value: 3, label: 'Nitroplus' },
  { value: 4, label: 'Leaf' },
  { value: 5, label: 'Frontwing' },
  { value: 6, label: 'Yuzusoft' },
]

export default function Demo() {
  const [studios, setStudios] = useState<Array<string | number>>([1])

  return (
    <MultiCombobox
      value={studios}
      onValueChange={setStudios}
      options={options}
      aria-label="Studios"
      className="w-80"
    />
  )
}
