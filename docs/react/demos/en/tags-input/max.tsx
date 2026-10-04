'use client'

import { useState } from 'react'
import { Stack, TagsInput, Text } from '@hina-ui/react'

export default function Demo() {
  const [tags, setTags] = useState(['Slice of life', 'Romance'])
  const [rejected, setRejected] = useState('')

  return (
    <Stack gap="sm" className="w-full max-w-sm">
      <TagsInput
        value={tags}
        onValueChange={setTags}
        max={3}
        placeholder="Up to three"
        aria-label="Genres"
        onInvalid={setRejected}
      />
      <Text tone="muted" size="sm">
        {rejected ? `"${rejected}" was not added` : 'Up to three, no duplicates'}
      </Text>
    </Stack>
  )
}
