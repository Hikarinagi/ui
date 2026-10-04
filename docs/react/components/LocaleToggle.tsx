'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Languages } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  IconButton,
} from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import { hrefFor, type Locale } from '~/lib/routes'

const LOCALES: Locale[] = ['zh-CN', 'en']

export function LocaleToggle({ locale }: { locale: Locale }) {
  const t = translator(locale)
  const pathname = usePathname()
  const router = useRouter()

  function change(value: string) {
    const target = LOCALES.find(code => code === value)
    if (!target || target === locale) return
    const path = locale === 'en' ? pathname.replace(/^\/en(?=\/|$)/, '') : pathname
    router.push(hrefFor(target, path))
  }

  return (
    <DropdownMenu
      label={t('locale.label')}
      align="end"
      content={
        <>
          <DropdownMenuLabel>{t('locale.label')}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={locale} onValueChange={change}>
            {LOCALES.map(code => (
              <DropdownMenuRadioItem key={code} value={code}>
                {t(`locale.${code}`)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </>
      }
    >
      <IconButton size="sm" label={t('locale.label')} tooltip={false}>
        <Languages />
      </IconButton>
    </DropdownMenu>
  )
}
