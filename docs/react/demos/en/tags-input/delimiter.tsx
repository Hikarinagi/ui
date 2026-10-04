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
      placeholder="Space separated, paste a whole list"
      aria-label="Aliases"
      className="max-w-sm"
    />
  )
}
