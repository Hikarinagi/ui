'use client'

import { useState } from 'react'
import { Switch } from '@hina-ui/react'

export default function Demo() {
  const [sync, setSync] = useState(true)

  return (
    <Switch
      checked={sync}
      onCheckedChange={setSync}
      description="Pick up where you left off when you open the same work on another device."
    >
      Sync reading progress
    </Switch>
  )
}
