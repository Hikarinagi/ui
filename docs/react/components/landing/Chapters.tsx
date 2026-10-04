import { Card, ScrollArea, Stack, Text } from '@hina-ui/react'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

const chapters = Array.from({ length: 24 }, (_, index) => String(index + 1))

export function LandingChapters({ locale }: { locale: Locale }) {
  const t = translator(locale)
  return (
    <Card padded={false} className="w-[220px]">
      <ScrollArea className="h-56">
        <Stack gap="none" className="p-2">
          {chapters.map(n => (
            <Text key={n} size="sm" className="px-3 py-2">
              {t('landing.wall.chapters.item', { n })}
            </Text>
          ))}
        </Stack>
      </ScrollArea>
    </Card>
  )
}
