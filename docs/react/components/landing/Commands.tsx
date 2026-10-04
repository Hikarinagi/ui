'use client'

import { Bookmark, House, Library, Moon, PenLine, Settings } from 'lucide-react'
import { CommandPalette, type CommandItems } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

export function LandingCommands({ locale }: { locale: Locale }) {
  const t = translator(locale)
  const items: CommandItems = [
    {
      label: t('landing.wall.commands.pages'),
      items: [
        { id: 'home', label: t('landing.wall.commands.home'), icon: House },
        { id: 'library', label: t('landing.wall.commands.library'), icon: Library },
        { id: 'bookmarks', label: t('landing.wall.commands.bookmarks'), icon: Bookmark },
        {
          id: 'settings',
          label: t('landing.wall.commands.settings'),
          icon: Settings,
          kbd: ['⌘', ','],
        },
      ],
    },
    {
      label: t('landing.wall.commands.actions'),
      items: [
        {
          id: 'review',
          label: t('landing.wall.commands.newReview'),
          icon: PenLine,
          description: t('landing.wall.commands.newReviewHint'),
        },
        { id: 'theme', label: t('landing.wall.commands.theme'), icon: Moon, kbd: ['⌘', 'D'] },
      ],
    },
  ]
  return (
    <CommandPalette
      inline
      items={items}
      placeholder={t('landing.wall.commands.placeholder')}
      className="w-[320px]"
    />
  )
}
