import { Card, Flex, Stack, Text } from '@hina-ui/react'

const items = Array.from({ length: 10 }, (_, i) => i + 1)

export default function Demo() {
  return (
    <Stack className="w-full max-w-xs">
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          With wrap, items move to the next line
        </Text>
        <Flex wrap gap="sm">
          {items.map(i => (
            <Card key={i} className="bg-inset size-10" padded={false} />
          ))}
        </Flex>
      </Stack>
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          Without it they stay on one line
        </Text>
        <Flex gap="sm" className="overflow-hidden">
          {items.map(i => (
            <Card key={i} className="bg-inset size-10 shrink-0" padded={false} />
          ))}
        </Flex>
      </Stack>
    </Stack>
  )
}
