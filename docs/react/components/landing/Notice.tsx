import { Alert } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

export function LandingNotice({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Alert tone="accent" title={t('landing.wall.notice.title')} closable className="w-[340px]">
      {t('landing.wall.notice.body')}
    </Alert>
  )
}
