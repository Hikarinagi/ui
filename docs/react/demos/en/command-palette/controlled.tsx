'use client'

import { useState } from 'react'
import { Button, CommandPalette, Inline, Text, type CommandItems } from '@hina-ui/react'

const items: CommandItems = [
  { id: 'home', label: 'Home' },
  { id: 'library', label: 'Library' },
  { id: 'settings', label: 'Settings' },
]

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <Inline gap="md" align="center">
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        Open from outside
      </Button>
      <Text size="sm" tone="muted">
        {open ? 'Open' : 'Closed'}
      </Text>
      <CommandPalette open={open} onOpenChange={setOpen} items={items} />
    </Inline>
  )
}
