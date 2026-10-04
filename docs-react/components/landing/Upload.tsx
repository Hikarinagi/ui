import { FileUpload, Stack, Text } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

export function LandingUpload({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Stack gap="sm" className="w-[300px]">
      <Text size="sm" weight="medium">
        {t('landing.wall.upload.label')}
      </Text>
      <FileUpload multiple accept="image/*" aria-label={t('landing.wall.upload.label')} />
    </Stack>
  )
}
