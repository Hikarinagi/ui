'use client'

import { useState } from 'react'
import { Combobox, type ComboboxValue } from '@hina-ui/react'

const works = [
  { value: 'summer-pockets', label: 'Summer Pockets' },
  { value: 'clannad', label: 'CLANNAD' },
  { value: 'little-busters', label: 'Little Busters!' },
  { value: 'rewrite', label: 'Rewrite' },
  { value: 'air', label: 'AIR' },
  { value: 'kanon', label: 'Kanon' },
]

export default function Demo() {
  const [work, setWork] = useState<ComboboxValue>(null)

  return (
    <Combobox
      value={work}
      onValueChange={setWork}
      options={works}
      placeholder="搜索作品"
      aria-label="作品"
      className="w-64"
    />
  )
}
