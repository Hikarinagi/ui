import { MeterGroup } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

export function LandingStorage({ locale }: { locale: Locale }) {
  const t = translator(locale)
  const items = [
    { label: t('landing.wall.storage.doc'), value: 42 },
    { label: t('landing.wall.storage.image'), value: 27 },
    { label: t('landing.wall.storage.video'), value: 13 },
    { label: t('landing.wall.storage.other'), value: 8 },
  ]
  return <MeterGroup label={t('landing.wall.storage.label')} items={items} className="w-[320px]" />
}
