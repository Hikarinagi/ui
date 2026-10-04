'use client'

import { useState } from 'react'
import { LayoutGrid, List, Rows3 } from 'lucide-react'
import { SegmentedControl } from '@hina-ui/react'

const icons = { grid: LayoutGrid, list: List, rows: Rows3 }
const options = [
  { value: 'grid', label: '网格' },
  { value: 'list', label: '列表' },
  { value: 'rows', label: '详情' },
]

export default function Demo() {
  const [view, setView] = useState<string | number>('grid')

  return (
    <SegmentedControl
      value={view}
      onValueChange={setView}
      options={options}
      aria-label="视图"
      renderOption={({ option }) => {
        const Icon = icons[option.value as keyof typeof icons]
        return <Icon />
      }}
    />
  )
}
