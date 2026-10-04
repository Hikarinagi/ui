'use client'

import { useState } from 'react'
import { Stack, TagsInput, Text } from '@hina-ui/react'

export default function Demo() {
  const [tags, setTags] = useState<string[]>([])

  return (
    <Stack gap="sm" className="w-full max-w-sm">
      <TagsInput
        value={tags}
        onValueChange={setTags}
        placeholder="Type and press Enter"
        aria-label="Keywords"
      />
      <Text tone="muted" size="sm">
        {tags.length ? tags.join(', ') : 'No tags yet'}
      </Text>
    </Stack>
  )
}
