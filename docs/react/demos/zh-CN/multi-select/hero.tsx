'use client'

import { useState } from 'react'
import { MultiSelect } from '@hina-ui/react'

const options = [
  { value: 'school', label: '校园' },
  { value: 'sf', label: '科幻' },
  { value: 'romance', label: '恋爱' },
  { value: 'mystery', label: '悬疑' },
  { value: 'fantasy', label: '奇幻' },
]

export default function Demo() {
  const [tags, setTags] = useState<Array<string | number>>(['school', 'sf'])

  return (
    <MultiSelect
      value={tags}
      onValueChange={setTags}
      options={options}
      aria-label="标签"
      className="w-72"
    />
  )
}
