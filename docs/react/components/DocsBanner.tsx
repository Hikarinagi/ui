'use client'

import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { Puzzle } from 'lucide-react'
import { Banner, Link } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import { hrefFor, type Locale } from '~/lib/routes'

export const BANNER_KEY = 'hn-docs-banner:preview'

function stored() {
  try {
    return localStorage.getItem(BANNER_KEY)
  } catch {
    return null
  }
}

function close() {
  try {
    localStorage.setItem(BANNER_KEY, 'closed')
  } catch {
    return
  }
}

export function DocsBanner({ locale, version }: { locale: Locale; version: string }) {
  const t = translator(locale)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (stored() === 'closed') setOpen(false)
  }, [])

  return (
    <Banner
      open={open}
      onOpenChange={setOpen}
      data-docs-banner={BANNER_KEY}
      closable
      onClose={close}
      icon={<Puzzle className="size-4 shrink-0" />}
    >
      {t('banner.text')}
      <Link asChild underline>
        <NextLink href={hrefFor(locale, '/changelog')}>{t('banner.link', { version })}</NextLink>
      </Link>
    </Banner>
  )
}
