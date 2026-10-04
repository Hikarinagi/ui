'use client'

import { useState } from 'react'
import { Button, CommandPalette, type CommandItems } from '@hina-ui/react'

const books = [
  { id: 'b1', label: 'Inherit the Stars', tags: ['sf', 'hard sf'] },
  { id: 'b2', label: 'Hyperion', tags: ['sf', 'space opera'] },
  { id: 'b3', label: 'Foundation', tags: ['sf', 'classic'] },
  { id: 'b4', label: 'The Three-Body Problem', tags: ['sf', 'chinese'] },
]

export default function Demo() {
  const [search, setSearch] = useState('')
  const query = search.trim().toLowerCase()
  const items: CommandItems = books
    .filter(book => !query || book.tags.some(tag => tag.includes(query)))
    .map(book => ({ id: book.id, label: book.label, description: book.tags.join(', ') }))

  return (
    <CommandPalette
      search={search}
      onSearchChange={setSearch}
      items={items}
      ignoreFilter
      placeholder="Search by tag"
    >
      <Button variant="outline" tone="neutral">
        Search by tag
      </Button>
    </CommandPalette>
  )
}
