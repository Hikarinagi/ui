'use client'

import { useState } from 'react'
import { Switch } from '@hina-ui/react'

export default function Demo() {
  const [autoplay, setAutoplay] = useState(true)

  return (
    <Switch checked={autoplay} onCheckedChange={setAutoplay}>
      Autoplay the next episode
    </Switch>
  )
}
