'use client'

import { useState } from 'react'
import { SegmentedControl } from '@hina-ui/react'

const options = [
  { value: 'day', label: '今日' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'all', label: '全部' },
]

export default function Demo() {
  const [range, setRange] = useState<string | number>('week')

  return (
    <SegmentedControl
      value={range}
      onValueChange={setRange}
      options={options}
      block
      aria-label="统计范围"
      className="max-w-md"
    />
  )
}
