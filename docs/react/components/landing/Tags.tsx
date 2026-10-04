import { Stack, TagsInput, Text } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

export function LandingTags({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Stack gap="sm" className="w-[256px]">
      <Text size="sm" weight="medium">
        {t('landing.wall.tags.label')}
      </Text>
      <TagsInput
        defaultValue={['Galgame', '轻小说']}
        placeholder={t('landing.wall.tags.placeholder')}
        aria-label={t('landing.wall.tags.label')}
      />
    </Stack>
  )
}
