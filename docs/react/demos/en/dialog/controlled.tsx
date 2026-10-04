'use client'

import { useState } from 'react'
import { Button, Dialog, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <Inline align="center">
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        Open from outside
      </Button>
      <Text tone="muted" size="sm">
        Currently {open ? 'open' : 'closed'}
      </Text>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="A dialog without a trigger"
        description="Outside state controls it."
        renderContent={() => (
          <Text>
            Leaving out the default slot renders no trigger, so `open` is the only way in.
          </Text>
        )}
        renderFooter={({ close }) => <Button onClick={close}>Close</Button>}
      />
    </Inline>
  )
}
