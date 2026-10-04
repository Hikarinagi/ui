'use client'

import { Bookmark, Home, Library, Moon, PenLine, Settings } from 'lucide-react'
import { CommandPalette, type CommandItems } from '@hina-ui/react'

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
      { id: 'review', label: 'New review', icon: PenLine, description: 'Log a book just finished' },
      { id: 'theme', label: 'Toggle theme', icon: Moon, kbd: ['⌘', 'D'] },
    ],
  },
]

export default function Demo() {
  return <CommandPalette inline items={items} className="max-w-sm" />
}
