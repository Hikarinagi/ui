'use client'

import { useState } from 'react'
import { BookOpen, Clapperboard, Gamepad2, type LucideIcon } from 'lucide-react'
import { Inline, Select, Stack, Text, type SelectOption, type SelectValue } from '@hina-ui/react'

const types: SelectOption<{ icon: LucideIcon }>[] = [
  {
    icon: Gamepad2,
    value: 'gal',
    label: 'Galgame',
    description: 'Visual novels and adventure games',
  },
  {
    icon: BookOpen,
    value: 'ln',
    label: 'Light novel',
    description: 'Bunko volumes and web serials',
  },
  { icon: Clapperboard, value: 'anime', label: 'Anime', description: 'TV, films and OVAs' },
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
      renderValue={({ option }) => (
        <Inline as="span" gap="sm" wrap={false}>
          <option.icon />
          {option.label}
        </Inline>
      )}
      renderOption={({ option }) => (
        <Inline as="span" gap="sm" wrap={false}>
          <option.icon />
          <Stack as="span" gap="none" className="min-w-0">
            <Text as="span">{option.label}</Text>
            <Text as="span" size="xs" tone="muted">
              {option.description}
            </Text>
          </Stack>
        </Inline>
      )}
    />
  )
}
