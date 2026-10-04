'use client'

import { useState } from 'react'
import { SegmentedControl } from '@hina-ui/react'

const options = [
  { value: 'all', label: '全部' },
  { value: 'ongoing', label: '连载中' },
  { value: 'done', label: '已完结' },
]

export default function Demo() {
  const [status, setStatus] = useState<string | number>('all')

  return (
    <SegmentedControl
      value={status}
      onValueChange={setStatus}
      options={options}
      aria-label="连载状态"
    />
  )
}
