'use client'

import { useState } from 'react'
import { Select, type SelectValue } from '@hina-ui/react'

const works = [
  { value: 'summer-pockets', label: 'Summer Pockets' },
  { value: 'clannad', label: 'CLANNAD' },
  { value: 'rewrite', label: 'Rewrite' },
]

export default function Demo() {
  const [work, setWork] = useState<SelectValue>('clannad')

  return (
    <Select
      value={work}
      onValueChange={setWork}
      options={works}
      clearable
      aria-label="Work"
      className="w-72"
    />
  )
}
