'use client'

import { useState } from 'react'
import { TagsInput } from '@hina-ui/react'

export default function Demo() {
  const [tags, setTags] = useState(['Galgame', 'Light novel'])

  return (
    <TagsInput
      value={tags}
      onValueChange={setTags}
      placeholder="Add a tag"
      aria-label="Tags"
      className="max-w-sm"
    />
  )
}
