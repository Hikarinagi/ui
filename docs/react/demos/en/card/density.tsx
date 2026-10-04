import { Card, Inline, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="start" className="w-full max-w-lg">
      <Card className="flex-1">
        <Stack gap="xs">
          <Text size="sm" tone="faint">
            comfortable
          </Text>
          <Text>20px of padding</Text>
        </Stack>
      </Card>
      <Card data-density="compact" className="flex-1">
        <Stack gap="xs">
          <Text size="sm" tone="faint">
            compact
          </Text>
          <Text>14px of padding</Text>
        </Stack>
      </Card>
    </Inline>
  )
}
