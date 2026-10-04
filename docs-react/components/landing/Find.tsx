import { SearchInput } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

export function LandingFind({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <SearchInput
      defaultValue=""
      placeholder={t('landing.wall.find.placeholder')}
      aria-label={t('landing.wall.find.label')}
      className="w-[256px]"
    />
  )
}
