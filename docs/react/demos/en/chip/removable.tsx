'use client'

import { useState } from 'react'
import { Chip, Inline } from '@hina-ui/react'

export default function Demo() {
  const [tags, setTags] = useState(['Sci-fi', 'School', 'Romance', 'Ensemble'])

  return (
    <Inline>
      {tags.map(tag => (
        <Chip key={tag} removable onRemove={() => setTags(tags.filter(item => item !== tag))}>
          {tag}
        </Chip>
      ))}
    </Inline>
  )
}
