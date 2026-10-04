import { BookOpen } from 'lucide-react'
import { Card, Statistic } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

export function LandingStats({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Card className="w-[260px]">
      <Statistic
        label={t('landing.wall.stats.label')}
        value={12480}
        delta={0.12}
        deltaLabel={t('landing.wall.stats.delta')}
        icon={<BookOpen />}
      />
    </Card>
  )
}
