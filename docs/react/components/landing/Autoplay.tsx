import { Switch } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

export function LandingAutoplay({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Switch defaultChecked description={t('landing.wall.autoplay.hint')} className="w-[256px]">
      {t('landing.wall.autoplay.label')}
    </Switch>
  )
}
