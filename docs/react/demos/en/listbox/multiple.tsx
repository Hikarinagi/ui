'use client'

import { useState } from 'react'
import { Listbox, Stack, Text } from '@hina-ui/react'

const options = [
  { value: 'school', label: 'School' },
  { value: 'sf', label: 'Sci-fi' },
  { value: 'romance', label: 'Romance' },
  { value: 'mystery', label: 'Mystery' },
]

export default function Demo() {
  const [tags, setTags] = useState<Array<string | number>>(['school'])

  return (
    <Stack className="w-56">
      <Listbox
        value={tags}
        onValueChange={value => setTags(value as Array<string | number>)}
        options={options}
        multiple
        aria-label="Tags"
      />
      <Text tone="muted">Chosen: {tags.length ? tags.join(', ') : 'none'}</Text>
    </Stack>
  )
}
