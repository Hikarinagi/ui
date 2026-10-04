'use client'

import { useState } from 'react'
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Inline,
  Stack,
  Text,
} from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <Stack className="w-full max-w-md">
      <Inline>
        <Button size="sm" variant="soft" tone="neutral" onClick={() => setOpen(!open)}>
          {open ? 'Collapse' : 'Expand'}
        </Button>
        <Text tone="muted" size="sm">
          open: {String(open)}
        </Text>
      </Inline>
      <Collapsible open={open} onOpenChange={setOpen}>
        <Stack gap="sm" align="start">
          <CollapsibleTrigger>The component&apos;s own trigger</CollapsibleTrigger>
          <CollapsibleContent>
            <Text tone="muted" size="sm">
              Both triggers drive the same state.
            </Text>
          </CollapsibleContent>
        </Stack>
      </Collapsible>
    </Stack>
  )
}
