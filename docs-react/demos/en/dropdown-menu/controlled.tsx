'use client'

import { useState } from 'react'
import { Button, DropdownMenu, DropdownMenuItem, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <Inline align="center">
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
        label="Controlled menu"
        content={
          <>
            <DropdownMenuItem>First item</DropdownMenuItem>
            <DropdownMenuItem>Second item</DropdownMenuItem>
          </>
        }
      >
        <Button variant="outline" tone="neutral">
          Menu
        </Button>
      </DropdownMenu>
      <Button size="sm" variant="soft" tone="neutral" onClick={() => setOpen(!open)}>
        {open ? 'Close' : 'Open'} from outside
      </Button>
      <Text tone="muted" size="sm">
        Currently: {open ? 'open' : 'closed'}
      </Text>
    </Inline>
  )
}
