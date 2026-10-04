import { Code, Inline, Stack, Text } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

const sizes = ['2xl', 'xl', 'lg', 'md', 'base', 'sm', 'xs'] as const
const weights = ['normal', 'medium', 'semibold'] as const

export function DesignTypography({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Stack gap="none" className="border-line divide-line divide-y rounded-lg border px-5">
      {sizes.map(size => (
        <Inline key={size} justify="between" className="min-h-20 py-4">
          <Text size={size}>{t('designPreview.typeSample')}</Text>
          <Code className="text-xs">{`--hn-text-${size}`}</Code>
        </Inline>
      ))}
      <Inline className="py-5" gap="lg">
        {weights.map(weight => (
          <Text key={weight} weight={weight}>
            {weight} Aa
          </Text>
        ))}
      </Inline>
    </Stack>
  )
}
