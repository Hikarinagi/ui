import { Stack, Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

const tabs = ['intro', 'cast', 'staff'] as const

export function LandingWorkTabs({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Tabs defaultValue="intro" className="w-[280px]">
      <TabsList label={t('landing.wall.workTabs.label')}>
        {tabs.map(key => (
          <TabsTrigger key={key} value={key}>
            {t(`landing.wall.workTabs.${key}`)}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(key => (
        <TabsContent key={key} value={key}>
          <Stack gap="xs" className="pt-4">
            <Text tone="muted" size="sm">
              {t(`landing.wall.workTabs.${key}Body`)}
            </Text>
          </Stack>
        </TabsContent>
      ))}
    </Tabs>
  )
}
