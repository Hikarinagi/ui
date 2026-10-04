import { Card, SimpleGrid, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-lg">
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          auto-fill by default: empty tracks stay, each item keeps one cell
        </Text>
        <SimpleGrid min="8rem" gap="sm">
          {[1, 2].map(i => (
            <Card key={i} className="bg-inset grid h-12 place-items-center" padded={false}>
              {i}
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          With fit: empty tracks collapse and the two items share the row
        </Text>
        <SimpleGrid min="8rem" gap="sm" fit>
          {[1, 2].map(i => (
            <Card key={i} className="bg-inset grid h-12 place-items-center" padded={false}>
              {i}
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Stack>
  )
}
