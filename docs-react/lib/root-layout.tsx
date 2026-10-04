import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { JetBrains_Mono, Noto_Sans, Noto_Sans_SC } from 'next/font/google'
import { BannerScript } from '~/components/BannerScript'
import { DocsShell } from '~/components/DocsShell'
import { Github } from '~/components/Github'
import { LocaleToggle } from '~/components/LocaleToggle'
import { Search } from '~/components/Search'
import { ThemeScript } from '~/components/ThemeScript'
import { ThemeToggle } from '~/components/ThemeToggle'
import { Wordmark } from '~/components/Wordmark'
import type { Locale } from '~/lib/routes'
import reactPackage from '../../packages/react/package.json'

const latin = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-docs-latin',
})
const sans = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-docs-sans',
})
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-docs-mono',
})

export const rootMetadata: Metadata = {
  title: { default: 'Hina UI for React', template: '%s · Hina UI for React' },
  icons: { icon: '/favicon.png' },
}

export function DocsRoot({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html
      lang={locale}
      className={`${latin.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <BannerScript />
      </head>
      <body>
        <DocsShell
          locale={locale}
          version={reactPackage.version}
          wordmark={<Wordmark />}
          github={<Github locale={locale} />}
          search={<Search locale={locale} />}
          localeToggle={<LocaleToggle locale={locale} />}
          themeToggle={<ThemeToggle locale={locale} />}
        >
          {children}
        </DocsShell>
      </body>
    </html>
  )
}
