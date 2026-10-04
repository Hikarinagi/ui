'use client'

import { useState } from 'react'
import { Bookmark, Star } from 'lucide-react'
import { Inline, Toggle } from '@hina-ui/react'

export default function Demo() {
  const [starred, setStarred] = useState(true)
  const [saved, setSaved] = useState(false)

  return (
    <Inline gap="xs">
      <Toggle
        value={starred}
        onValueChange={setStarred}
        label="收藏"
        pill
        renderIcon={() => <Star />}
        pressedIcon={<Star fill="currentColor" />}
      />
      <Toggle
        value={saved}
        onValueChange={setSaved}
        label="稍后再看"
        pill
        renderIcon={() => <Bookmark />}
        pressedIcon={<Bookmark fill="currentColor" />}
      />
    </Inline>
  )
}
