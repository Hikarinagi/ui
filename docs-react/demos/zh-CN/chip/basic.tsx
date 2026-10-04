'use client'

import { useState } from 'react'
import { Chip, Inline } from '@hina-ui/react'

export default function Demo() {
  const [finished, setFinished] = useState(true)
  const [kept, setKept] = useState(true)

  return (
    <Inline>
      <Chip selected={finished} onSelectedChange={setFinished} selectable>
        已完结
      </Chip>
      {kept && (
        <Chip removable onRemove={() => setKept(false)}>
          科幻
        </Chip>
      )}
    </Inline>
  )
}
