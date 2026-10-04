'use client'

import { useState } from 'react'
import { TagsInput } from '@hina-ui/react'

export default function Demo() {
  const [tags, setTags] = useState<string[]>([])

  return (
    <TagsInput
      value={tags}
      onValueChange={setTags}
      delimiter=" "
      addOnBlur
      placeholder="以空格分隔，可以整段粘贴"
      aria-label="别名"
      className="max-w-sm"
    />
  )
}
