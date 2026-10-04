'use client'

import { useState } from 'react'
import { Listbox, type ListboxValue } from '@hina-ui/react'

const sorts = [
  { value: 'latest', label: 'Recently updated' },
  {
    label: 'By rating',
    options: [
      { value: 'rating-desc', label: 'Rating, high to low' },
      { value: 'rating-asc', label: 'Rating, low to high' },
    ],
  },
  {
    label: 'By release',
    options: [
      { value: 'release-desc', label: 'Newest release' },
      { value: 'release-asc', label: 'Oldest release' },
    ],
  },
]

export default function Demo() {
  const [sort, setSort] = useState<ListboxValue>('latest')

  return (
    <Listbox
      value={sort}
      onValueChange={setSort}
      options={sorts}
      aria-label="Sort"
      className="w-56"
    />
  )
}
