import { Card, Flex, Stack, Text } from '@hina-ui/react'

const aligns = ['start', 'center', 'end', 'stretch'] as const
const justifies = ['start', 'center', 'end', 'between'] as const

export default function Demo() {
  return (
    <Stack>
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          align 管交叉轴
        </Text>
        <Flex gap="lg" wrap>
          {aligns.map(align => (
            <Stack key={align} gap="xs">
              <Text tone="muted" size="sm">
                {align}
              </Text>
              <Flex align={align} gap="sm" className="bg-inset h-24 rounded-md p-3">
                <Card className="bg-surface h-8 w-8" padded={false} />
                <Card className="bg-surface h-12 w-8" padded={false} />
              </Flex>
            </Stack>
          ))}
        </Flex>
      </Stack>
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          justify 管主轴
        </Text>
        <Flex direction="col" gap="sm">
          {justifies.map(justify => (
            <Flex key={justify} justify={justify} className="bg-inset w-64 rounded-md p-3">
              <Card className="bg-surface size-8" padded={false} />
              <Card className="bg-surface size-8" padded={false} />
            </Flex>
          ))}
        </Flex>
      </Stack>
    </Stack>
  )
}
