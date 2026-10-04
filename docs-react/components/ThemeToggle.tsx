'use client'

import { Moon, Sun } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  IconButton,
} from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'
import { setThemePreference, useThemePreference } from '~/lib/theme'

export function ThemeToggle({ locale }: { locale: Locale }) {
  const t = translator(locale)
  const { preference, dark } = useThemePreference()

  return (
    <DropdownMenu
      label={t('theme.label')}
      align="end"
      content={
        <>
          <DropdownMenuLabel>{t('theme.label')}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={preference} onValueChange={setThemePreference}>
            <DropdownMenuRadioItem value="light">{t('theme.light')}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">{t('theme.dark')}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">{t('theme.system')}</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </>
      }
    >
      <IconButton size="sm" label={t('theme.label')} tooltip={false}>
        {dark ? <Moon /> : <Sun />}
      </IconButton>
    </DropdownMenu>
  )
}
