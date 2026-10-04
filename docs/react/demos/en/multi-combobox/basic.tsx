'use client'

import { useState } from 'react'
import { MultiCombobox, Stack, Text } from '@hina-ui/react'

const options = [
  { value: 'school', label: 'School' },
  { value: 'sf', label: 'Science fiction' },
  { value: 'romance', label: 'Romance' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'daily', label: 'Slice of life' },
]

export default function Demo() {
  const [genres, setGenres] = useState<Array<string | number>>([])

  return (
    <Stack gap="sm" className="w-full max-w-sm">
      <MultiCombobox
        value={genres}
        onValueChange={setGenres}
        options={options}
        placeholder="Type a genre"
        aria-label="Genres"
      />
      <Text tone="muted" size="sm">
        {genres.length ? genres.join(', ') : 'Nothing chosen yet'}
      </Text>
    </Stack>
  )
}
