import { Button, Card, Heading, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="h-64 w-full max-w-xs">
      <Stack justify="between" className="h-full">
        <Stack gap="xs">
          <Heading level={3} size="md">
            Storage
          </Heading>
          <Text tone="muted" size="sm">
            12.4 GB used of 20 GB.
          </Text>
        </Stack>
        <Button variant="soft" tone="neutral">
          Upgrade
        </Button>
      </Stack>
    </Card>
  )
}
