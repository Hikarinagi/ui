import { Inline, Link, PinInput, Stack, Text } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

export function LandingVerify({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Stack gap="sm" align="start" className="w-[280px]">
      <Stack gap="none">
        <Text size="sm" weight="medium">
          {t('landing.wall.verify.label')}
        </Text>
        <Text tone="muted" size="sm">
          {t('landing.wall.verify.hint')}
        </Text>
      </Stack>
      <PinInput defaultValue="4320" type="number" otp aria-label={t('landing.wall.verify.label')} />
      <Inline gap="xs" align="center">
        <Text tone="muted" size="sm">
          {t('landing.wall.verify.resendPrefix')}
        </Text>
        <Link as="button" type="button" className="text-sm">
          {t('landing.wall.verify.resend')}
        </Link>
      </Inline>
    </Stack>
  )
}
