'use client'

import { useState } from 'react'
import { Chip, Inline } from '@hina-ui/react'

export default function Demo() {
  const [finished, setFinished] = useState(true)
  const [translated, setTranslated] = useState(false)

  return (
    <Inline>
      <Chip selected={finished} onSelectedChange={setFinished} selectable>
        Finished
      </Chip>
      <Chip selected={translated} onSelectedChange={setTranslated} selectable>
        Translated
      </Chip>
    </Inline>
  )
}
