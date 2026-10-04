import { SegmentedControl } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

export function LandingShelf({ locale }: { locale: Locale }) {
  const t = translator(locale)
  const options = ['all', 'ongoing', 'done'].map(value => ({
    value,
    label: t(`landing.wall.shelf.${value}`),
  }))
  return (
    <SegmentedControl
      defaultValue="ongoing"
      options={options}
      aria-label={t('landing.wall.shelf.label')}
    />
  )
}
