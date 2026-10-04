import NextLink from 'next/link'
import { Link, Section, SimpleGrid, Stack, Text } from '@hina-ui/react'
import { componentName, translator } from '~/lib/i18n'
import { categories, components } from '~/lib/nav'
import { hrefFor, type Locale } from '~/lib/routes'

export function ComponentsOverview({ locale }: { locale: Locale }) {
  const t = translator(locale)
  const groups = categories
    .map(category => ({
      slug: category.slug,
      items: components.filter(item => item.category === category.slug),
    }))
    .filter(group => group.items.length > 0)

  return (
    <Stack gap="xl">
      {groups.map(group => (
        <Section key={group.slug} id={group.slug} title={t(`categories.${group.slug}.label`)}>
          <Text tone="muted">{t(`categories.${group.slug}.description`)}</Text>
          <SimpleGrid min="14rem" gap="md">
            {group.items.map(item => {
              const name = componentName(locale, item.to)
              return (
                <Stack key={item.to} gap="none">
                  <Link asChild>
                    <NextLink href={hrefFor(locale, item.to)}>
                      {item.label}
                      {name && (
                        <Text as="span" tone="faint" className="ms-1.5">
                          {name}
                        </Text>
                      )}
                    </NextLink>
                  </Link>
                  <Text tone="muted" size="sm">
                    {t(item.i18n)}
                  </Text>
                </Stack>
              )
            })}
          </SimpleGrid>
        </Section>
      ))}
    </Stack>
  )
}
