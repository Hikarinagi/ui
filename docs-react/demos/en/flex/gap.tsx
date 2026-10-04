import { Card, Flex, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Flex gap="xl" wrap>
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          A row takes 12 pixels at md
        </Text>
        <Flex gap="md" className="bg-inset rounded-md p-3">
          <Card className="bg-surface size-8" padded={false} />
          <Card className="bg-surface size-8" padded={false} />
          <Card className="bg-surface size-8" padded={false} />
        </Flex>
      </Stack>
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          A column takes 16 pixels at md
        </Text>
        <Flex direction="col" gap="md" className="bg-inset rounded-md p-3">
          <Card className="bg-surface size-8" padded={false} />
          <Card className="bg-surface size-8" padded={false} />
          <Card className="bg-surface size-8" padded={false} />
        </Flex>
      </Stack>
    </Flex>
  )
}
