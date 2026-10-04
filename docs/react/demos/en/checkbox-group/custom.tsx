'use client'

import { useState } from 'react'
import { BookOpen, Gamepad2, Images } from 'lucide-react'
import { CheckboxGroup, Inline } from '@hina-ui/react'

const icons = { gal: Gamepad2, ln: BookOpen, manga: Images }
const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: 'Light novel' },
  { value: 'manga', label: 'Manga' },
]

export default function Demo() {
  const [types, setTypes] = useState<Array<string | number>>(['gal'])

  return (
    <CheckboxGroup
      value={types}
      onValueChange={setTypes}
      options={options}
      aria-label="Work types"
      renderOption={({ option }) => {
        const Icon = icons[option.value as keyof typeof icons]
        return (
          <Inline as="span" gap="xs" align="center">
            <Icon className="text-muted size-4" />
            {option.label}
          </Inline>
        )
      }}
    />
  )
}
