import { Progress } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

export function LandingUploading({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Progress value={62} label={t('landing.wall.progress.label')} showValue className="w-[256px]" />
  )
}
