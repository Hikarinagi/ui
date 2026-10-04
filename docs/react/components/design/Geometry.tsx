import { Button, Card, Grid, Inline, Input, Stack, Text } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

const densities = ['comfortable', 'compact'] as const
const radii = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const shadows = ['sm', 'md', 'lg'] as const

export function DesignGeometry({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Stack gap="lg">
      <Grid className="grid-cols-1 gap-4 sm:grid-cols-2">
        {densities.map(density => (
          <Card key={density} data-density={density} className="shadow-none">
            <Stack>
              <Text weight="medium">{t(`designPreview.${density}`)}</Text>
              <Input
                aria-label={t(`designPreview.${density}`)}
                placeholder={t('designPreview.input')}
              />
              <Inline>
                <Button>{t('designPreview.primary')}</Button>
                <Button variant="outline" tone="neutral">
                  {t('designPreview.secondary')}
                </Button>
              </Inline>
            </Stack>
          </Card>
        ))}
      </Grid>
      <Grid className="grid-cols-3 gap-4 sm:grid-cols-5">
        {radii.map(radius => (
          <Stack key={radius} gap="sm" align="center">
            <Stack
              className="border-accent bg-accent-soft size-16 border"
              style={{ borderRadius: `var(--hn-radius-${radius})` }}
              aria-hidden="true"
            />
            <Text size="xs" tone="muted" className="font-mono">
              {radius}
            </Text>
          </Stack>
        ))}
      </Grid>
      <Grid className="bg-canvas grid-cols-1 gap-6 rounded-lg p-6 sm:grid-cols-3">
        {shadows.map(shadow => (
          <Stack
            key={shadow}
            className="bg-surface border-line h-24 items-center justify-center rounded-lg border"
            style={{ boxShadow: `var(--hn-shadow-${shadow})` }}
          >
            <Text size="sm" className="font-mono">{`shadow-${shadow}`}</Text>
          </Stack>
        ))}
      </Grid>
    </Stack>
  )
}
