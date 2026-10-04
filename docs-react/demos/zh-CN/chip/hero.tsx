'use client'

import { useState } from 'react'
import { Chip, Inline } from '@hina-ui/react'

const genres = ['科幻', '奇幻', '日常', '悬疑', '恋爱']

export default function Demo() {
  const [picked, setPicked] = useState(['科幻', '日常'])

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
