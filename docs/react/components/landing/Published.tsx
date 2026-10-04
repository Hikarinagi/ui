import { Button, Result } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

export function LandingPublished({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Result
      status="success"
      title={t('landing.wall.published.title')}
      description={t('landing.wall.published.body')}
      className="w-[300px]"
      actions={
        <>
          <Button size="sm">{t('landing.wall.published.view')}</Button>
          <Button size="sm" variant="ghost" tone="neutral">
            {t('landing.wall.published.back')}
          </Button>
        </>
      }
    />
  )
}
