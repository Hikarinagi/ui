'use client'

import { useState } from 'react'
import { BookOpen, Clapperboard, Gamepad2, type LucideIcon } from 'lucide-react'
import { Inline, MultiSelect } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: 'Light novel' },
  { value: 'anime', label: 'Anime' },
]
const icons: Record<string, LucideIcon> = { gal: Gamepad2, ln: BookOpen, anime: Clapperboard }

export default function Demo() {
  const [types, setTypes] = useState<Array<string | number>>(['gal'])

  return (
    <MultiSelect
      value={types}
      onValueChange={setTypes}
      options={options}
      aria-label="Work types"
      className="w-72"
      renderOption={({ option }) => {
        const Icon = icons[option.value]!
        return (
          <Inline as="span" gap="sm" wrap={false}>
            <Icon />
            {option.label}
          </Inline>
        )
      }}
    />
  )
}
