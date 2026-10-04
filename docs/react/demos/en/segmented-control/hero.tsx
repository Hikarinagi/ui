'use client'

import { useState } from 'react'
import { SegmentedControl } from '@hina-ui/react'

const options = [
  { value: 'all', label: 'All' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'done', label: 'Completed' },
]

export default function Demo() {
  const [status, setStatus] = useState<string | number>('all')

  return (
    <SegmentedControl
      value={status}
      onValueChange={setStatus}
      options={options}
      aria-label="Status"
    />
  )
}
