'use client'

import { useState } from 'react'
import { Button, Inline, Text, Tooltip } from '@hina-ui/react'

export default function Demo() {
  const [off, setOff] = useState(true)
  return (
    <Inline align="center">
      <Tooltip content="Only needed while the sidebar is collapsed" disabled={off}>
        <Button variant="outline" tone="neutral">
          Hover me
        </Button>
      </Tooltip>
      <Button size="sm" variant="soft" tone="neutral" onClick={() => setOff(!off)}>
        {off ? 'Enable' : 'Disable'} the tooltip
      </Button>
      <Text tone="muted" size="sm">
        Currently {off ? 'disabled' : 'enabled'}
      </Text>
    </Inline>
  )
}
