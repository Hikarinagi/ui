'use client'

import { useState } from 'react'
import { Flame, Star } from 'lucide-react'
import { Chip, Inline } from '@hina-ui/react'

export default function Demo() {
  const [hot, setHot] = useState(true)
  const [starred, setStarred] = useState(false)

  return (
    <Inline>
      <Chip selected={hot} onSelectedChange={setHot} selectable icon={<Flame />}>
        热门
      </Chip>
      <Chip selected={starred} onSelectedChange={setStarred} selectable icon={<Star />}>
        收藏
      </Chip>
      <Chip removable icon={<Star />}>
        收藏
      </Chip>
    </Inline>
  )
}
