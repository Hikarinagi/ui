'use client'

import { useState } from 'react'
import { RadioGroup } from '@hina-ui/react'

const options = [
  { value: 'updated', label: 'Recently updated' },
  { value: 'rating', label: 'Rating' },
  { value: 'title', label: 'Title' },
]

export default function Demo() {
  const [sort, setSort] = useState<string | number | null | undefined>('updated')

  return (
    <RadioGroup
      value={sort}
      onValueChange={setSort}
      options={options}
      orientation="horizontal"
      aria-label="Sort by"
    />
  )
}
