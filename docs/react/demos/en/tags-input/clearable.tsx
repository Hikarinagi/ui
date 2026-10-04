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
      placeholder="Add a studio"
      aria-label="Studios"
      className="max-w-sm"
    />
  )
}
