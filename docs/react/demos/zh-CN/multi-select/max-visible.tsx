'use client'

import { useState } from 'react'
import { MultiSelect, Stack } from '@hina-ui/react'

const options = [
  { value: 'school', label: '校园' },
  { value: 'sf', label: '科幻' },
  { value: 'romance', label: '恋爱' },
  { value: 'mystery', label: '悬疑' },
  { value: 'fantasy', label: '奇幻' },
]

export default function Demo() {
  const [tags, setTags] = useState<Array<string | number>>(['school', 'sf', 'romance', 'mystery'])

  return (
    <Stack className="w-96">
      <MultiSelect
        value={tags}
        onValueChange={setTags}
        options={options}
        maxVisible={1}
        aria-label="最多一个"
      />
      <MultiSelect
        value={tags}
        onValueChange={setTags}
        options={options}
        maxVisible={3}
        aria-label="最多三个"
      />
    </Stack>
  )
}
