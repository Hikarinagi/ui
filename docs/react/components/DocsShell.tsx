'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, type ReactNode } from 'react'
import {
  AppShell,
  type AppShellHandle,
  Button,
  Inline,
  NavLink,
  Sidebar,
  SidebarGroup,
  SidebarTrigger,
  Text,
  Toaster,
  UiLocaleProvider,
  enUS,
  zhCN,
} from '@hina-ui/react'
import { hrefFor, type Locale } from '~/lib/routes'
import { componentName, translator } from '~/lib/i18n'
import { nav, primary } from '~/lib/nav'
import { useScrollRestore } from '~/lib/useScrollRestore'
import { DocsBanner } from './DocsBanner'

interface DocsShellProps {
  locale: Locale
  version: string
  wordmark: ReactNode
  search?: ReactNode
  github?: ReactNode
  localeToggle?: ReactNode
  themeToggle?: ReactNode
  children?: ReactNode
}

export function DocsShell({
  locale,
  version,
  wordmark,
  search,
  github,
  localeToggle,
  themeToggle,
  children,
}: DocsShellProps) {
  const pathname = usePathname()
  const t = translator(locale)
  const path = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
  const landing = path === '/'
  const restoreKey = landing ? 'landing' : 'main'
  const shell = useRef<AppShellHandle>(null)
  useScrollRestore(restoreKey, shell)
  const current = (to: string) => path === to
  const active = (match: string) => path.startsWith(match)

  const sidebar = (
    <Sidebar
      label={t('nav.docsNav')}
      closable={false}
      className="lg:[&>.hn-collapse]:hidden"
      renderWordmark={() => (
        <NextLink href={hrefFor(locale, '/')} className="hn-focus-ring inline-flex rounded-sm">
          {wordmark}
        </NextLink>
      )}
    >
      {nav.map(group => (
        <SidebarGroup key={group.label} label={t(group.label)}>
          {group.items.map(item => {
            const label = item.label ?? t(item.labelI18n!)
            const name = componentName(locale, item.to)
            return (
              <NavLink
                key={item.to}
                as={NextLink}
                href={hrefFor(locale, item.to)}
                label={label}
                active={current(item.to)}
              >
                {label}
                {name && (
                  <Text as="span" size="sm" tone="faint" className="ms-1.5">
                    {name}
                  </Text>
                )}
              </NavLink>
            )
          })}
        </SidebarGroup>
      ))}
    </Sidebar>
  )

  return (
    <UiLocaleProvider messages={locale === 'en' ? enUS : zhCN}>
      <AppShell
        ref={shell}
        collapsible={landing ? undefined : 'hidden'}
        restoreKey={restoreKey}
        banner={<DocsBanner locale={locale} version={version} />}
        header={
          <>
            {!landing && <SidebarTrigger />}
            <Button
              as={NextLink}
              href={hrefFor(locale, '/')}
              variant="ghost"
              tone="neutral"
              size="sm"
            >
              {wordmark}
            </Button>
            <Inline gap="xs" className="max-md:hidden">
              {primary.map(item => (
                <Button
                  key={item.to}
                  as={NextLink}
                  href={hrefFor(locale, item.to)}
                  variant="ghost"
                  size="sm"
                  tone={active(item.match) ? 'accent' : 'neutral'}
                  aria-current={active(item.match) ? 'page' : undefined}
                >
                  {t(item.label)}
                </Button>
              ))}
            </Inline>
            <Inline gap="xs" className="ms-auto">
              {search}
              {github}
              {localeToggle}
              {themeToggle}
            </Inline>
          </>
        }
        sidebarContent={landing ? undefined : sidebar}
      >
        {children}
        <Toaster />
      </AppShell>
    </UiLocaleProvider>
  )
}
