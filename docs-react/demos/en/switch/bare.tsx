'use client'

import { useState } from 'react'
import { Inline, Switch } from '@hina-ui/react'

export default function Demo() {
  const [dark, setDark] = useState(false)

  return (
    <Inline gap="sm">
      <Switch checked={dark} onCheckedChange={setDark} aria-label="Dark mode" />
    </Inline>
  )
}
