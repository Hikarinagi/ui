import { Select } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

export function LandingSort({ locale }: { locale: Locale }) {
  const t = translator(locale)
  const options = ['date', 'score', 'saves'].map(value => ({
    value,
    label: t(`landing.wall.sort.${value}`),
  }))
  return (
    <Select
      defaultValue="score"
      options={options}
      aria-label={t('landing.wall.sort.label')}
      className="w-[256px]"
    />
  )
}
