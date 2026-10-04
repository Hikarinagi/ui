import { Card, SimpleGrid, Stack, Text } from '@hina-ui/react'

const mins = ['6rem', '10rem', '16rem'] as const

export default function Demo() {
  return (
    <Stack className="w-full max-w-lg">
      {mins.map(min => (
        <Stack key={min} gap="xs">
          <Text tone="muted" size="sm">
            min {min}
          </Text>
          <SimpleGrid min={min} gap="sm">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="bg-inset h-10" padded={false} />
            ))}
          </SimpleGrid>
        </Stack>
      ))}
    </Stack>
  )
}
