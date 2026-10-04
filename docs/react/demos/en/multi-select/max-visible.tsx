'use client'

import { useState } from 'react'
import { MultiSelect, Stack } from '@hina-ui/react'

const options = [
  { value: 'school', label: 'School' },
  { value: 'sf', label: 'Sci-fi' },
  { value: 'romance', label: 'Romance' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'fantasy', label: 'Fantasy' },
]

export default function Demo() {
  const [tags, setTags] = useState<Array<string | number>>(['school', 'sf', 'romance', 'mystery'])

  return (
    <Stack className="w-96">
      <MultiSelect
        value={tags}
        onValueChange={setTags}
        options={options}
        maxVisible={1}
        aria-label="At most one"
      />
      <MultiSelect
        value={tags}
        onValueChange={setTags}
        options={options}
        maxVisible={3}
        aria-label="At most three"
      />
    </Stack>
  )
}
