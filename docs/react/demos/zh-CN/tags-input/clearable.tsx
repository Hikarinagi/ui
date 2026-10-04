'use client'

import { useState } from 'react'
import { TagsInput } from '@hina-ui/react'

export default function Demo() {
  const [tags, setTags] = useState(['Key', 'Type-Moon', 'Nitroplus'])

  return (
    <TagsInput
      value={tags}
      onValueChange={setTags}
      clearable
      placeholder="添加制作公司"
      aria-label="制作公司"
      className="max-w-sm"
    />
  )
}
