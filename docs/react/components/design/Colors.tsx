import { Card, Code, Grid, Inline, Stack, Tag, Text } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

const tones = ['accent', 'success', 'warning', 'danger', 'info'] as const
const surfaces = ['canvas', 'surface', 'subtle', 'inset'] as const
const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
const surfaceTokens = {
  canvas: '--hn-bg-canvas',
  surface: '--hn-surface',
  subtle: '--hn-bg-subtle',
  inset: '--hn-bg-inset',
}

export function DesignColors({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Stack gap="lg">
      <Grid className="grid-cols-1 gap-3 sm:grid-cols-2">
        {tones.map(tone => (
          <Card key={tone} className="shadow-none">
            <Stack gap="sm">
              <Inline justify="between">
                <Text weight="medium">{t(`designPreview.${tone}`)}</Text>
                <Tag tone={tone}>{tone}</Tag>
              </Inline>
              <Inline wrap={false} gap="sm">
                <Stack
                  className="h-14 flex-1 items-center justify-center rounded-sm"
                  style={{ background: `var(--hn-${tone})`, color: `var(--hn-${tone}-on)` }}
                >
                  <Text as="span" size="sm" className="text-inherit">
                    Aa
                  </Text>
                </Stack>
                <Stack
                  className="h-14 flex-1 items-center justify-center rounded-sm"
                  style={{ background: `var(--hn-${tone}-soft)`, color: `var(--hn-${tone}-text)` }}
                >
                  <Text as="span" size="sm" className="text-inherit">
                    Aa
                  </Text>
                </Stack>
              </Inline>
              <Code className="w-fit text-xs">{`--hn-${tone}`}</Code>
            </Stack>
          </Card>
        ))}
        <Card className="shadow-none">
          <Stack gap="sm">
            <Text weight="medium">{t('designPreview.foreground')}</Text>
            <Text>{t('designPreview.defaultText')}</Text>
            <Text tone="muted">{t('designPreview.mutedText')}</Text>
            <Text tone="faint">{t('designPreview.faintText')}</Text>
          </Stack>
        </Card>
      </Grid>
      <Grid className="grid-cols-2 gap-3 sm:grid-cols-4">
        {surfaces.map(surface => (
          <Stack key={surface} gap="sm">
            <Stack
              className="border-line h-20 items-center justify-center rounded-md border"
              style={{ background: `var(${surfaceTokens[surface]})` }}
            >
              <Text size="sm">{surface}</Text>
            </Stack>
            <Text size="xs" tone="muted" className="font-mono break-all">
              {surfaceTokens[surface]}
            </Text>
          </Stack>
        ))}
      </Grid>
      <Stack gap="sm">
        <Text size="sm" weight="medium">
          {t('designPreview.brandScale')}
        </Text>
        <Grid className="grid-cols-6 gap-2 sm:grid-cols-11">
          {steps.map(step => (
            <Stack key={step} gap="xs" align="center">
              <Stack
                className="border-line h-12 w-full rounded-sm border"
                style={{ background: `var(--color-brand-${step})` }}
                aria-hidden="true"
              />
              <Text size="xs" tone="muted" className="tabular-nums">
                {step}
              </Text>
            </Stack>
          ))}
        </Grid>
      </Stack>
    </Stack>
  )
}
