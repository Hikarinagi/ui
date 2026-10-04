'use client'

import { useState } from 'react'
import { Listbox, Stack, Text } from '@hina-ui/react'

const options = [
  { value: 'school', label: '校园' },
  { value: 'sf', label: '科幻' },
  { value: 'romance', label: '恋爱' },
  { value: 'mystery', label: '悬疑' },
]

export default function Demo() {
  const [tags, setTags] = useState<Array<string | number>>(['school'])

  return (
    <Stack className="w-56">
      <Listbox
        value={tags}
        onValueChange={value => setTags(value as Array<string | number>)}
        options={options}
        multiple
        aria-label="标签"
      />
      <Text tone="muted">已选：{tags.length ? tags.join('、') : '无'}</Text>
    </Stack>
  )
}
