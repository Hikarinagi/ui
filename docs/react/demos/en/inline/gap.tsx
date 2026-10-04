import { Card, Inline, Stack, Text } from '@hina-ui/react'

const gaps = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const

export default function Demo() {
  return (
    <Stack>
      {gaps.map(gap => (
        <Stack key={gap} gap="xs">
          <Text tone="muted" size="sm">
            {gap}
          </Text>
          <Inline gap={gap}>
            <Card className="bg-inset size-8" padded={false} />
            <Card className="bg-inset size-8" padded={false} />
            <Card className="bg-inset size-8" padded={false} />
          </Inline>
        </Stack>
      ))}
    </Stack>
  )
}
