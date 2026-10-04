import { KeyRound } from 'lucide-react'
import { siGithub } from 'simple-icons'
import { Avatar, Button, Card, Divider, Heading, Stack, Text } from '@hina-ui/react'
import { BrandIcon } from '~/components/BrandIcon'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

export function LandingSignIn({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Card className="w-[320px]">
      <Stack gap="md" align="center">
        <Avatar size="lg" />
        <Stack gap="xs" align="center">
          <Heading level={3} size="md">
            {t('landing.wall.signIn.title')}
          </Heading>
          <Text tone="muted" size="sm" className="text-center text-balance">
            {t('landing.wall.signIn.body')}
          </Text>
        </Stack>
        <Button block icon={<KeyRound />}>
          {t('landing.wall.signIn.passkey')}
        </Button>
        <Divider className="w-full">{t('landing.wall.signIn.or')}</Divider>
        <Button block variant="outline" tone="neutral" icon={<BrandIcon icon={siGithub} />}>
          {t('landing.wall.signIn.github')}
        </Button>
      </Stack>
    </Card>
  )
}
