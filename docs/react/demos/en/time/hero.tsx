import { Stack, Text, Time } from '@hina-ui/react'

export default function Demo() {
  const published = new Date('2026-03-14T09:30:00+08:00')
  const edited = new Date(Date.now() - 12 * 60 * 1000)

  return (
    <Stack className="max-w-sm">
      <Text>
        Published <Time value={published} />
      </Text>
      <Text tone="muted">
        Last edited <Time value={edited} format="relative" />
      </Text>
    </Stack>
  )
}
