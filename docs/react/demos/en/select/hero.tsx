'use client'

import { useState } from 'react'
import { Select, type SelectValue } from '@hina-ui/react'

const types = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: 'Light novel' },
  { value: 'manga', label: 'Manga' },
  { value: 'anime', label: 'Anime' },
]

export default function Demo() {
  const [type, setType] = useState<SelectValue>('gal')

  return (
    <Select
      value={type}
      onValueChange={setType}
      options={types}
      aria-label="Work type"
      className="w-64"
    />
  )
}
