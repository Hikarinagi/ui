'use client'

import { useState } from 'react'
import { Listbox, Stack, Text, type ListboxValue } from '@hina-ui/react'

const types = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: 'Light novel' },
  { value: 'manga', label: 'Manga' },
  { value: 'anime', label: 'Anime' },
]

export default function Demo() {
  const [type, setType] = useState<ListboxValue>(null)

  return (
    <Stack className="w-56">
      <Listbox value={type} onValueChange={setType} options={types} aria-label="Work type" />
      <Text tone="muted">Current value: {type ?? 'none'}</Text>
    </Stack>
  )
}
