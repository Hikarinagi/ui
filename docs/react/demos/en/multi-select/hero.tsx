'use client'

import { useState } from 'react'
import { MultiSelect } from '@hina-ui/react'

const options = [
  { value: 'school', label: 'School' },
  { value: 'sf', label: 'Sci-fi' },
  { value: 'romance', label: 'Romance' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'fantasy', label: 'Fantasy' },
]

export default function Demo() {
  const [tags, setTags] = useState<Array<string | number>>(['school', 'sf'])

  return (
    <MultiSelect
      value={tags}
      onValueChange={setTags}
      options={options}
      aria-label="Tags"
      className="w-72"
    />
  )
}
