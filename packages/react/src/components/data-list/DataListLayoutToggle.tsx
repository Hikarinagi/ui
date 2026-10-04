'use client'

import { LayoutGrid, List } from 'lucide-react'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { SegmentedControl } from '../segmented-control/SegmentedControl'
import type { DataListLayout } from './types'

const ListIcon = lucide(List)
const GridIcon = lucide(LayoutGrid)

export interface DataListLayoutToggleProps {
  value: DataListLayout
  onValueChange: (value: DataListLayout) => void
  className?: string
}

export function DataListLayoutToggle({
  value,
  onValueChange,
  className,
}: DataListLayoutToggleProps) {
  const t = useUiLocale()
  const options = [
    { value: 'list', label: t.dataList.list },
    { value: 'grid', label: t.dataList.grid },
  ]
  return (
    <SegmentedControl
      value={value}
      options={options}
      aria-label={t.dataList.layout}
      className={className}
      onValueChange={next => onValueChange(next === 'grid' ? 'grid' : 'list')}
      renderOption={({ option }) =>
        option.value === 'list' ? <ListIcon className="size-4" /> : <GridIcon className="size-4" />
      }
    />
  )
}
