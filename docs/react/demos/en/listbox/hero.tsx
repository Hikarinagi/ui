'use client'

import { useState } from 'react'
import { Listbox, type ListboxValue } from '@hina-ui/react'

const statuses = [
  { value: 'wish', label: 'Want to read' },
  { value: 'doing', label: 'Reading' },
  { value: 'done', label: 'Finished' },
  { value: 'dropped', label: 'Dropped' },
]

export default function Demo() {
  const [status, setStatus] = useState<ListboxValue>('doing')

  return (
    <Listbox
      value={status}
      onValueChange={setStatus}
      options={statuses}
      aria-label="Collection status"
      className="w-56"
    />
  )
}
