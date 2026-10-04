'use client'

import { useState } from 'react'
import { Bookmark, Home, Library, LogOut, Moon, PenLine, Search, Settings } from 'lucide-react'
import { Button, CommandPalette, Kbd, Stack, Text, type CommandItems } from '@hina-ui/react'

const items: CommandItems = [
  {
    label: 'Pages',
    items: [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'library', label: 'Library', icon: Library },
      { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
      { id: 'settings', label: 'Settings', icon: Settings, kbd: ['⌘', ','] },
    ],
  },
  {
    label: 'Actions',
    items: [
      {
        id: 'review',
        label: 'New review',
        icon: PenLine,
        description: 'Write about a book you just finished',
      },
      { id: 'theme', label: 'Toggle theme', icon: Moon, kbd: ['⌘', 'D'] },
      { id: 'logout', label: 'Sign out', icon: LogOut },
    ],
  },
]

export default function Demo() {
  const [picked, setPicked] = useState('')

  return (
    <Stack gap="md" align="start">
      <CommandPalette items={items} hotkey="mod+j" onSelect={item => setPicked(item.label)}>
        <Button variant="outline" tone="neutral" icon={<Search />}>
          Search
          <Kbd>⌘J</Kbd>
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
