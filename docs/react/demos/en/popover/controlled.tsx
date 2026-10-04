'use client'

import { useState } from 'react'
import { Button, Inline, Popover, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <Inline align="center">
      <Popover
        open={open}
        onOpenChange={setOpen}
        content={
          <Stack gap="sm" className="w-56">
            <Text size="sm">This panel can be opened and closed from outside.</Text>
            <Button size="sm" variant="soft" tone="neutral" onClick={() => setOpen(false)}>
              Got it
            </Button>
          </Stack>
        }
      >
        <Button variant="outline" tone="neutral">
          Details
        </Button>
      </Popover>
      <Button size="sm" variant="soft" tone="neutral" onClick={() => setOpen(!open)}>
        {open ? 'Close' : 'Open'} from outside
      </Button>
      <Text tone="muted" size="sm">
        Currently {open ? 'open' : 'closed'}
      </Text>
    </Inline>
  )
}
