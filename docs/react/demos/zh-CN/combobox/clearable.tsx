'use client'

import { useState } from 'react'
import { Combobox, type ComboboxValue } from '@hina-ui/react'

const works = [
  { value: 'summer-pockets', label: 'Summer Pockets' },
  { value: 'clannad', label: 'CLANNAD' },
  { value: 'rewrite', label: 'Rewrite' },
]

export default function Demo() {
  const [work, setWork] = useState<ComboboxValue>('clannad')

  return (
    <Combobox
      value={work}
      onValueChange={setWork}
      options={works}
      clearable
      aria-label="作品"
      className="w-72"
    />
  )
}
