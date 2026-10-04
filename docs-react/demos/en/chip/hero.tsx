'use client'

import { useState } from 'react'
import { Chip, Inline } from '@hina-ui/react'

const genres = ['Sci-fi', 'Fantasy', 'Slice of life', 'Mystery', 'Romance']

export default function Demo() {
  const [picked, setPicked] = useState(['Sci-fi', 'Slice of life'])

  function toggle(genre: string, on: boolean) {
    setPicked(on ? [...picked, genre] : picked.filter(item => item !== genre))
  }

  return (
    <Inline>
      {genres.map(genre => (
        <Chip
          key={genre}
          selectable
          selected={picked.includes(genre)}
          onSelectedChange={value => toggle(genre, value)}
        >
          {genre}
        </Chip>
      ))}
    </Inline>
  )
}
