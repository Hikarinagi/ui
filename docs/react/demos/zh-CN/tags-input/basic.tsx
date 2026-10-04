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
        placeholder="输入后按 Enter"
        aria-label="关键词"
      />
      <Text tone="muted" size="sm">
        {tags.length ? tags.join('、') : '还没有标签'}
      </Text>
    </Stack>
  )
}
