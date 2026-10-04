'use client'

import { useState } from 'react'
import { Button, CommandPalette, Stack, Text, type CommandItems } from '@hina-ui/react'

const items: CommandItems = [
  { id: 'home', label: 'Home' },
  { id: 'library', label: 'Library' },
  { id: 'bookmarks', label: 'Bookmarks' },
  { id: 'settings', label: 'Settings' },
]

export default function Demo() {
  const [picked, setPicked] = useState('')

  return (
    <Stack gap="md" align="start">
      <CommandPalette items={items} onSelect={item => setPicked(item.label)}>
        <Button variant="outline" tone="neutral">
          Open panel
        </Button>
      </CommandPalette>
      {picked && (
        <Text size="sm" tone="muted">
          Selected: {picked}
        </Text>
      )}
    </Stack>
  )
}
