import { Card, Flex, Stack, Text } from '@hina-ui/react'

const directions = ['row', 'row-reverse', 'col', 'col-reverse'] as const

export default function Demo() {
  return (
    <Flex gap="lg" wrap>
      {directions.map(direction => (
        <Stack key={direction} gap="xs">
          <Text tone="muted" size="sm">
            {direction}
          </Text>
          <Flex direction={direction} gap="sm" className="bg-inset rounded-md p-3">
            <Card className="bg-surface grid size-8 place-items-center text-sm" padded={false}>
              1
            </Card>
            <Card className="bg-surface grid size-8 place-items-center text-sm" padded={false}>
              2
            </Card>
            <Card className="bg-surface grid size-8 place-items-center text-sm" padded={false}>
              3
            </Card>
          </Flex>
        </Stack>
      ))}
    </Flex>
  )
}
