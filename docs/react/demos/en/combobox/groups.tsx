'use client'

import { useState } from 'react'
import { Combobox, type ComboboxValue } from '@hina-ui/react'

const tags = [
  {
    label: 'Theme',
    options: [
      { value: 'school', label: 'School' },
      { value: 'sf', label: 'Sci-fi' },
      { value: 'fantasy', label: 'Fantasy' },
    ],
  },
  {
    label: 'Form',
    options: [
      { value: 'kinetic', label: 'Kinetic' },
      { value: 'branch', label: 'Branching' },
    ],
  },
]

export default function Demo() {
  const [tag, setTag] = useState<ComboboxValue>(null)

  return (
    <Combobox
      value={tag}
      onValueChange={setTag}
      options={tags}
      placeholder="Search tags"
      aria-label="Tags"
      className="w-64"
    />
  )
}
