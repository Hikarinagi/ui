'use client'

import { useState } from 'react'
import { Button, DisclosureIcon, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <Inline>
      <Button
        variant="soft"
        tone="neutral"
        onClick={() => setOpen(!open)}
        trailing={<DisclosureIcon open={open} />}
      >
        State held outside
      </Button>
      <Text tone="muted" size="sm">
        open: {String(open)}
      </Text>
    </Inline>
  )
}
