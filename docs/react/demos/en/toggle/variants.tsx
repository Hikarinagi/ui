'use client'

import { useState } from 'react'
import { Pin } from 'lucide-react'
import { Inline, Toggle } from '@hina-ui/react'

export default function Demo() {
  const [ghost, setGhost] = useState(true)
  const [outline, setOutline] = useState(true)

  return (
    <Inline gap="sm">
      <Toggle value={ghost} onValueChange={setGhost} variant="ghost" renderIcon={() => <Pin />}>
        Pinned
      </Toggle>
      <Toggle
        value={outline}
        onValueChange={setOutline}
        variant="outline"
        renderIcon={() => <Pin />}
      >
        Pinned
      </Toggle>
    </Inline>
  )
}
