import { Card, SimpleGrid, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-lg">
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          默认 auto-fill：空轨道保留，两个子项各占一格
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
          fit 为真：空轨道塌陷，两个子项分掉整行
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
