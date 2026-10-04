import { Inline, RingProgress, Stack, Text } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

export function LandingRing({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Inline gap="md" align="center" className="w-[260px]">
      <RingProgress value={72} showValue aria-label={t('landing.wall.ring.label')} />
      <Stack gap="none">
        <Text size="sm" weight="medium">
          {t('landing.wall.ring.label')}
        </Text>
        <Text tone="muted" size="sm">
          {t('landing.wall.ring.hint')}
        </Text>
      </Stack>
    </Inline>
  )
}
