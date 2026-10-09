'use client'

import { useState } from 'react'
import { Button, CommandPalette, type CommandItem, type CommandItems } from '@hina-ui/react'

const recent = ['Spice and Wolf', 'Keiichi Sigsawa']
const hot = ['Hyouka', 'Book Girl']

const books: CommandItem[] = [
  { id: 'spice', label: 'Spice and Wolf', description: 'Isuna Hasekura' },
  { id: 'kino', label: "Kino's Journey", description: 'Keiichi Sigsawa' },
  { id: 'hyouka', label: 'Hyouka', description: 'Honobu Yonezawa' },
  { id: 'book-girl', label: 'Book Girl', description: 'Mizuki Nomura' },
]

export default function Demo() {
  const [search, setSearch] = useState('')

  function suggest(text: string): CommandItem {
    return { id: text, label: text, closeOnSelect: false, onSelect: () => setSearch(text) }
  }

  const items: CommandItems = search.trim()
    ? books
    : [
        { label: 'Recent searches', items: recent.map(suggest) },
        { label: 'Popular searches', items: hot.map(suggest) },
      ]

  return (
    <CommandPalette
      search={search}
      onSearchChange={setSearch}
      items={items}
      placeholder="Search by title or author"
    >
      <Button variant="outline" tone="neutral">
        Search books
      </Button>
    </CommandPalette>
  )
}
