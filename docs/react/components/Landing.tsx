import NextLink from 'next/link'
import { ArrowRight, Rocket } from 'lucide-react'
import { Container, Divider, Heading, Inline, SimpleGrid, Stack, Tag, Text } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import { components } from '~/lib/nav'
import { hrefFor, type Locale } from '~/lib/routes'
import { HikarinagiWordmark } from './HikarinagiWordmark'
import { LandingWall } from './LandingWall'
import { LinkButton } from './LinkButton'
import { Wordmark } from './Wordmark'

const FEATURES = ['modes', 'appearance', 'a11y', 'scaffolding'] as const

export function Landing({ locale, version }: { locale: Locale; version: string }) {
  const t = translator(locale)
  const href = (to: string) => hrefFor(locale, to)
  const [before, after] = t('landing.title', { brand: '{brand}' }).split('{brand}')
  return (
    <Stack gap="none">
      <Container size="xl" className="py-24 sm:py-32 lg:py-40">
        <Stack gap="xl" align="center" className="text-center">
          <Stack gap="md" align="center">
            <Tag
              asChild
              pill
              tone="accent"
              className="hn-interactive h-8 gap-1.5 px-3.5 text-base [&_svg]:size-4"
            >
              <NextLink href={href('/changelog')}>
                <Rocket />
                {t('landing.release', { version })}
              </NextLink>
            </Tag>
            <Heading level={1} size="2xl" className="max-w-4xl text-5xl text-balance sm:text-7xl">
              {before}
              <HikarinagiWordmark />
              {after}
            </Heading>
            <Text tone="muted" size="xl" className="mt-6 max-w-2xl text-balance break-keep">
              {t('landing.subtitle', { count: String(components.length) })}
            </Text>
          </Stack>
          <Inline gap="lg" className="mt-4">
            <LinkButton href={href('/guide/installation')} size="lg">
              {t('landing.start')}
            </LinkButton>
            <LinkButton
              href={href('/components')}
              size="lg"
              variant="outline"
              tone="neutral"
              trailing={<ArrowRight />}
            >
              {t('landing.browse')}
            </LinkButton>
          </Inline>
        </Stack>
      </Container>

      <LandingWall locale={locale} />

      <Container size="xl" className="pt-16 sm:pt-24 lg:pt-32">
        <SimpleGrid min="14rem" gap="xl">
          {FEATURES.map(key => (
            <Stack key={key} gap="xs">
              <Text as="h2" weight="medium">
                {t(`landing.features.${key}.title`)}
              </Text>
              <Text tone="muted" size="sm">
                {t(`landing.features.${key}.body`)}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>

        <Divider className="mt-16" />

        <Inline justify="between" align="center" className="py-6">
          <Wordmark />
          <Text tone="faint" size="sm" weight="medium">
            {t('landing.copyright')}
          </Text>
        </Inline>
      </Container>
    </Stack>
  )
}
