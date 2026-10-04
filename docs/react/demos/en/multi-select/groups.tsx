'use client'

import { useState } from 'react'
import { MultiSelect } from '@hina-ui/react'

const options = [
  { value: 'zh', label: 'Simplified Chinese' },
  {
    label: 'Japanese',
    options: [
      { value: 'ja', label: 'Japanese original' },
      { value: 'ja-tl', label: 'Japanese with translation' },
    ],
  },
  {
    label: 'Others',
    options: [
      { value: 'en', label: 'English' },
      { value: 'ko', label: 'Korean' },
    ],
  },
]

export default function Demo() {
  const [languages, setLanguages] = useState<Array<string | number>>(['zh'])

  return (
    <MultiSelect
      value={languages}
      onValueChange={setLanguages}
      options={options}
      aria-label="Languages"
      className="w-72"
    />
  )
}
