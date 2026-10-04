'use client'

import { useState } from 'react'
import { MultiCombobox, Stack, Text } from '@hina-ui/react'

const options = [
  { value: 'school', label: '校园' },
  { value: 'sf', label: '科幻' },
  { value: 'romance', label: '恋爱' },
  { value: 'mystery', label: '悬疑' },
  { value: 'fantasy', label: '奇幻' },
  { value: 'daily', label: '日常' },
]

export default function Demo() {
  const [genres, setGenres] = useState<Array<string | number>>([])

  return (
    <Stack gap="sm" className="w-full max-w-sm">
      <MultiCombobox
        value={genres}
        onValueChange={setGenres}
        options={options}
        placeholder="输入题材"
        aria-label="题材"
      />
      <Text tone="muted" size="sm">
        {genres.length ? genres.join('、') : '还没有选择'}
      </Text>
    </Stack>
  )
}
