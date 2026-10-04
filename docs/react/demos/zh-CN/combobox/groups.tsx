'use client'

import { useState } from 'react'
import { Combobox, type ComboboxValue } from '@hina-ui/react'

const tags = [
  {
    label: '题材',
    options: [
      { value: 'school', label: '校园' },
      { value: 'sf', label: '科幻' },
      { value: 'fantasy', label: '奇幻' },
    ],
  },
  {
    label: '形式',
    options: [
      { value: 'kinetic', label: '线性剧情' },
      { value: 'branch', label: '多线分支' },
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
      placeholder="搜索标签"
      aria-label="标签"
      className="w-64"
    />
  )
}
