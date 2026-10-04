import { Card, Heading, Image, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card padded={false} className="w-full max-w-sm overflow-hidden">
      <Image src="/sample.webp" alt="A slope on a summer afternoon" className="h-32 w-full" />
      <Stack gap="xs" className="p-[var(--hn-panel-p)]">
        <Heading level={3} size="base">
          The slope down to the station
        </Heading>
        <Text tone="muted" size="sm">
          The image runs to the edge, and an inner container supplies the padding instead.
        </Text>
      </Stack>
    </Card>
  )
}
