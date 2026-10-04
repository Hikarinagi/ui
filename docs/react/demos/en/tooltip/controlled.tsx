'use client'

import { useState } from 'react'
import { Button, Inline, Switch, Tooltip } from '@hina-ui/react'

export default function Demo() {
  const [shown, setShown] = useState(true)
  return (
    <Inline gap="lg" align="center">
      <Tooltip content="Controlled by the switch" open={shown}>
        <Button variant="outline" tone="neutral">
          Tooltip trigger
        </Button>
      </Tooltip>
      <Switch checked={shown} onCheckedChange={setShown}>
        Show tooltip
      </Switch>
    </Inline>
  )
}
