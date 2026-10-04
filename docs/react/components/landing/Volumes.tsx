import { RangeSlider, Stack, Text } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

export function LandingVolumes({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Stack gap="sm" className="w-[256px]">
      <Text size="sm" weight="medium">
        {t('landing.wall.volumes.label')}
      </Text>
      <RangeSlider
        defaultValue={[120, 680]}
        min={0}
        max={1000}
        step={10}
        aria-label={t('landing.wall.volumes.label')}
      />
    </Stack>
  )
}
