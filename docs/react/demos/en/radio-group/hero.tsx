'use client'

import { useState } from 'react'
import { RadioGroup } from '@hina-ui/react'

const options = [
  { value: 'wish', label: 'Want to read' },
  { value: 'doing', label: 'Reading' },
  { value: 'done', label: 'Finished' },
]

export default function Demo() {
  const [status, setStatus] = useState<string | number | null | undefined>('doing')

  return (
    <RadioGroup
      value={status}
      onValueChange={setStatus}
      options={options}
      aria-label="Library status"
    />
  )
}
