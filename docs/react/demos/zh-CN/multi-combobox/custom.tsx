'use client'

import { useState } from 'react'
import { Inline, MultiCombobox, Text } from '@hina-ui/react'

const options = [
  { value: 12, label: '校园', description: '1 204 部作品' },
  { value: 34, label: '科幻', description: '388 部作品' },
  { value: 56, label: '恋爱', description: '2 019 部作品' },
  { value: 78, label: '悬疑', description: '271 部作品' },
]

export default function Demo() {
  const [tags, setTags] = useState<Array<string | number>>([12])

  return (
    <MultiCombobox
      value={tags}
      onValueChange={setTags}
      options={options}
      aria-label="标签"
      className="w-80"
      renderOption={({ option }) => (
        <Inline gap="sm" align="center" wrap={false} className="min-w-0">
          <Text as="span" className="truncate">
            {option.label}
          </Text>
          <Text as="span" tone="muted" size="xs" className="ms-auto shrink-0 font-mono">
            #{option.value}
          </Text>
        </Inline>
      )}
    />
  )
}
