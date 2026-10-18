'use client'

import { useState } from 'react'
import { SegmentedControl } from '@hina-ui/react'

const options = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'updated', label: 'Recently updated' },
  { value: 'favorites', label: 'Most favorited' },
  { value: 'comments', label: 'Most comments' },
  { value: 'words', label: 'Longest' },
  { value: 'rating', label: 'Top rated' },
]

export default function Demo() {
  const [sort, setSort] = useState<string | number>('relevance')

  return (
    <SegmentedControl
      value={sort}
      onValueChange={setSort}
      options={options}
      className="max-w-xs"
      aria-label="Sort by"
    />
  )
}
