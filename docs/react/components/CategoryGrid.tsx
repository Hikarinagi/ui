import 'server-only'
import NextLink from 'next/link'
import { Card, Heading, Ripple, SimpleGrid, Stack, Text } from '@hina-ui/react'
import type { DemoMap } from '~/lib/demo-map'
import { componentName, translator } from '~/lib/i18n'
import { components } from '~/lib/nav'
import { hrefFor, type Locale } from '~/lib/routes'
import { CategoryPreview } from './CategoryPreview'

export function CategoryGrid({
  slug,
  locale,
  demos,
}: {
  slug: string
  locale: Locale
  demos: DemoMap
}) {
  const t = translator(locale)
  const items = components
    .filter(item => item.category === slug)
    .map(item => ({
      ...item,
      Preview: demos[`${item.to.slice(item.to.lastIndexOf('/') + 1)}/hero`],
    }))

  return (
    <SimpleGrid min="20rem" gap="lg">
      {items.map(({ Preview, ...item }) => {
        const name = componentName(locale, item.to)
        return (
          <Card
            key={item.to}
            padded={false}
            className="hn-interactive hn-state-layer hn-press-lg overflow-hidden focus-within:outline-[var(--hn-focus-ring-width)] focus-within:outline-offset-[var(--hn-focus-ring-offset)] focus-within:outline-[var(--hn-focus-ring)]"
          >
            <Ripple />
            <CategoryPreview>{Preview ? <Preview /> : null}</CategoryPreview>
            <Stack gap="xs" className="p-5">
              <Heading level={3} size="md">
                <NextLink
                  href={hrefFor(locale, item.to)}
                  className="outline-none after:absolute after:inset-0"
                >
                  {item.label}
                  {name && (
                    <Text as="span" size="sm" tone="faint" className="ms-1.5">
                      {name}
                    </Text>
                  )}
                </NextLink>
              </Heading>
              <Text tone="muted" size="sm">
                {t(item.i18n)}
              </Text>
            </Stack>
          </Card>
        )
      })}
    </SimpleGrid>
  )
}
