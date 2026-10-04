'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Languages, Monitor, Moon, Search as SearchIcon, Sun } from 'lucide-react'
import { Button, CommandPalette, IconButton, Kbd, type CommandItems } from '@hina-ui/react'
import type { SearchPage } from '../../shared/search-index'
import { componentName, translator } from '~/lib/i18n'
import { categories, categoryPath, components, design, guides } from '~/lib/nav'
import { hrefFor, type Locale } from '~/lib/routes'
import { setThemePreference } from '~/lib/theme'

const LOCALES: Locale[] = ['zh-CN', 'en']

export function Search({ locale }: { locale: Locale }) {
  const t = translator(locale)
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [mac, setMac] = useState(true)
  const [index, setIndex] = useState<SearchPage[]>()

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform))
  }, [])

  useEffect(() => {
    if (!open || index) return
    let active = true
    void fetch(`/search-index/${locale}`)
      .then(response => response.json() as Promise<SearchPage[]>)
      .then(pages => {
        if (active) setIndex(pages)
      })
    return () => {
      active = false
    }
  }, [open, index, locale])

  const go = (to: string, hash?: string) => () => {
    const path = hrefFor(locale, to)
    router.push(hash ? `${path}#${hash}` : path)
    if (hash && pathname === path) document.getElementById(hash)?.scrollIntoView({ block: 'start' })
  }

  const bare = locale === 'en' ? pathname.replace(/^\/en(?=\/|$)/, '') : pathname

  const pages: CommandItems = [
    {
      label: t('nav.start'),
      items: guides.map(item => ({
        id: item.to,
        label: item.label ?? t(item.labelI18n!),
        description: t(item.i18n),
        onSelect: go(item.to),
      })),
    },
    {
      label: t('nav.design'),
      items: design.map(item => ({
        id: item.to,
        label: t(item.labelI18n!),
        description: t(item.i18n),
        keywords: [item.to.split('/').at(-1)!],
        onSelect: go(item.to),
      })),
    },
    {
      label: t('search.categories'),
      items: [
        {
          id: '/components',
          label: t('nav.components'),
          description: index?.find(page => page.to === '/components')?.description,
          keywords: ['components'],
          onSelect: go('/components'),
        },
        ...categories.map(category => ({
          id: categoryPath(category.slug),
          label: t(`categories.${category.slug}.label`),
          description: t(`categories.${category.slug}.description`),
          keywords: [category.slug],
          onSelect: go(categoryPath(category.slug)),
        })),
      ],
    },
    ...categories.map(category => ({
      label: t(`categories.${category.slug}.label`),
      items: components
        .filter(item => item.category === category.slug)
        .map(item => ({
          id: item.to,
          label: item.label!,
          description: t(item.i18n),
          keywords: [
            componentName(locale, item.to),
            item.to.slice(item.to.lastIndexOf('/') + 1),
            t(`categories.${category.slug}.label`),
          ].filter((keyword): keyword is string => !!keyword),
          onSelect: go(item.to),
        })),
    })),
  ]

  const sections: CommandItems = search.trim()
    ? [
        {
          label: t('search.sections'),
          items: (index ?? []).flatMap(page =>
            page.headings.map(heading => ({
              id: `${page.to}#${heading.id}`,
              label: heading.label,
              description: heading.parent ? `${page.title} › ${heading.parent}` : page.title,
              onSelect: go(page.to, heading.id),
            })),
          ),
        },
      ]
    : []

  const actions: CommandItems = [
    {
      label: t('search.actions'),
      items: [
        {
          id: 'theme-system',
          label: t('theme.system'),
          description: t('theme.label'),
          icon: Monitor,
          keywords: [t('theme.label'), 'theme', 'system'],
          onSelect: () => setThemePreference('system'),
        },
        {
          id: 'theme-light',
          label: t('theme.light'),
          description: t('theme.label'),
          icon: Sun,
          keywords: [t('theme.label'), 'theme', 'light'],
          onSelect: () => setThemePreference('light'),
        },
        {
          id: 'theme-dark',
          label: t('theme.dark'),
          description: t('theme.label'),
          icon: Moon,
          keywords: [t('theme.label'), 'theme', 'dark'],
          onSelect: () => setThemePreference('dark'),
        },
        ...LOCALES.filter(code => code !== locale).map(code => ({
          id: `locale-${code}`,
          label: t(`locale.${code}`),
          description: t('locale.label'),
          icon: Languages,
          keywords: [t('locale.label'), 'language', 'locale'],
          onSelect: () => router.push(hrefFor(code, bare)),
        })),
      ],
    },
  ]

  return (
    <>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        search={search}
        onSearchChange={setSearch}
        items={[...pages, ...actions, ...sections]}
        hotkey="mod+k"
        label={t('search.label')}
        placeholder={t('search.placeholder')}
      />
      <Button
        variant="outline"
        tone="neutral"
        size="sm"
        className="max-md:hidden"
        icon={<SearchIcon />}
        onClick={() => setOpen(true)}
      >
        {t('search.label')}
        <Kbd>{mac ? '⌘K' : 'Ctrl K'}</Kbd>
      </Button>
      <IconButton
        size="sm"
        label={t('search.label')}
        tooltip={false}
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
      </IconButton>
    </>
  )
}
