'use client'

import { useState } from 'react'
import { Button, HoverCard, Inline, Link, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <Inline gap="lg" align="center">
      <Button variant="outline" tone="neutral" disabled={open} onClick={() => setOpen(true)}>
        Open the card
      </Button>
      <HoverCard
        open={open}
        onOpenChange={setOpen}
        content={
          <Text size="sm">
            Opened from outside; moving the pointer away, clicking outside or pressing Esc closes
            it.
          </Text>
        }
      >
        <Link href="#">Preview</Link>
      </HoverCard>
      <Text tone="muted" size="sm">
        {open ? 'Open' : 'Closed'}
      </Text>
    </Inline>
  )
}
