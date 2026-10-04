'use client'

import { useState } from 'react'
import { BookOpen, Clapperboard, Gamepad2, type LucideIcon } from 'lucide-react'
import { Inline, Listbox, Stack, Text, type ListboxValue } from '@hina-ui/react'

const types = [
  { value: 'gal', label: 'Galgame', description: 'Visual novels and adventure games' },
  { value: 'ln', label: 'Light novel', description: 'Bunko volumes and web serials' },
  { value: 'anime', label: 'Anime', description: 'TV, films and OVAs' },
]
const icons: Record<string, LucideIcon> = { gal: Gamepad2, ln: BookOpen, anime: Clapperboard }

export default function Demo() {
  const [type, setType] = useState<ListboxValue>('gal')

  return (
    <Listbox
      value={type}
      onValueChange={setType}
      options={types}
      aria-label="Work type"
      className="w-64"
      renderOption={({ option }) => {
        const Icon = icons[option.value]!
        return (
          <Inline as="span" gap="sm" wrap={false}>
            <Icon />
            <Stack as="span" gap="none" className="min-w-0">
              <Text as="span">{option.label}</Text>
              <Text as="span" size="xs" tone="muted">
                {option.description}
              </Text>
            </Stack>
          </Inline>
        )
      }}
    />
  )
}
