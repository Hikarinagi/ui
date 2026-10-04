'use client'

import { useState } from 'react'
import { TagsInput } from '@hina-ui/react'

export default function Demo() {
  const [tags, setTags] = useState(['Galgame', '轻小说'])

  return (
    <TagsInput
      value={tags}
      onValueChange={setTags}
      placeholder="添加标签"
      aria-label="作品标签"
      className="max-w-sm"
    />
  )
}
