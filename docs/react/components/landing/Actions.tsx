import { Button, Grid } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

const actions = [
  { key: 'read', variant: 'solid', tone: 'accent' },
  { key: 'save', variant: 'soft', tone: 'accent' },
  { key: 'share', variant: 'outline', tone: 'neutral' },
  { key: 'review', variant: 'ghost', tone: 'neutral' },
  { key: 'remove', variant: 'soft', tone: 'danger' },
  { key: 'report', variant: 'solid', tone: 'danger' },
] as const

export function LandingActions({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Grid cols={3} gap="sm" className="w-[280px]">
      {actions.map(action => (
        <Button key={action.key} size="sm" variant={action.variant} tone={action.tone}>
          {t(`landing.wall.actions.${action.key}`)}
        </Button>
      ))}
    </Grid>
  )
}
