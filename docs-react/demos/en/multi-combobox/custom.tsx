'use client'

import { useState } from 'react'
import { Inline, MultiCombobox, Text } from '@hina-ui/react'

const options = [
  { value: 12, label: 'School', description: '1,204 works' },
  { value: 34, label: 'Science fiction', description: '388 works' },
  { value: 56, label: 'Romance', description: '2,019 works' },
  { value: 78, label: 'Mystery', description: '271 works' },
]

export default function Demo() {
  const [tags, setTags] = useState<Array<string | number>>([12])

  return (
    <MultiCombobox
      value={tags}
      onValueChange={setTags}
      options={options}
      aria-label="Tags"
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
