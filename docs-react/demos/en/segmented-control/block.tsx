'use client'

import { useState } from 'react'
import { SegmentedControl } from '@hina-ui/react'

const options = [
  { value: 'day', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
  { value: 'all', label: 'All time' },
]

export default function Demo() {
  const [range, setRange] = useState<string | number>('week')

  return (
    <SegmentedControl
      value={range}
      onValueChange={setRange}
      options={options}
      block
      aria-label="Range"
      className="max-w-md"
    />
  )
}
