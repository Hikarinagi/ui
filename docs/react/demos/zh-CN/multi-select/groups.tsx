'use client'

import { useState } from 'react'
import { MultiSelect } from '@hina-ui/react'

const options = [
  { value: 'zh', label: '简体中文' },
  {
    label: '日文',
    options: [
      { value: 'ja', label: '日文原版' },
      { value: 'ja-tl', label: '日文（附翻译）' },
    ],
  },
  {
    label: '其他',
    options: [
      { value: 'en', label: '英文' },
      { value: 'ko', label: '韩文' },
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
      aria-label="语言"
      className="w-72"
    />
  )
}
