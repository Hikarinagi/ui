import { Card, Image, Inline, Rating, Stack, Tag, Text } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

export function LandingCover({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Card padded={false} className="w-[260px] overflow-hidden">
      <Image
        src="/cover.webp"
        alt={t('landing.wall.cover.alt')}
        ratio={1058 / 1500}
        lazy={false}
        eager
      />
      <Stack gap="xs" align="start" className="p-4">
        <Text weight="medium">{t('landing.wall.cover.title')}</Text>
        <Text tone="muted" size="sm">
          {t('landing.wall.cover.brand')}
        </Text>
        <Inline gap="sm" align="center" className="pt-1">
          <Rating defaultValue={4} size="sm" aria-label={t('landing.wall.cover.title')} />
          <Tag tone="info">{t('landing.wall.cover.tag')}</Tag>
        </Inline>
      </Stack>
    </Card>
  )
}
