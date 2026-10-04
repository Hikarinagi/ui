'use client'

import { useState } from 'react'
import { Stack, TagsInput, Text } from '@hina-ui/react'

export default function Demo() {
  const [tags, setTags] = useState(['日常', '恋爱'])
  const [rejected, setRejected] = useState('')

  return (
    <Stack gap="sm" className="w-full max-w-sm">
      <TagsInput
        value={tags}
        onValueChange={setTags}
        max={3}
        placeholder="最多三个"
        aria-label="题材"
        onInvalid={setRejected}
      />
      <Text tone="muted" size="sm">
        {rejected ? `「${rejected}」未加入` : '最多三个，不允许重复'}
      </Text>
    </Stack>
  )
}
