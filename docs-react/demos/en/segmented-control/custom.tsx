'use client'

import { useState } from 'react'
import { LayoutGrid, List, Rows3 } from 'lucide-react'
import { SegmentedControl } from '@hina-ui/react'

const icons = { grid: LayoutGrid, list: List, rows: Rows3 }
const options = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'rows', label: 'Details' },
]

export default function Demo() {
  const [view, setView] = useState<string | number>('grid')

  return (
    <SegmentedControl
      value={view}
      onValueChange={setView}
      options={options}
      aria-label="View"
      renderOption={({ option }) => {
        const Icon = icons[option.value as keyof typeof icons]
        return <Icon />
      }}
    />
  )
}
