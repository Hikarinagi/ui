import { Card, Inline, Stack, Text } from '@hina-ui/react'

const gaps = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const

export default function Demo() {
  return (
    <Inline align="start" className="gap-8">
      {gaps.map(gap => (
        <Stack key={gap} gap="xs">
          <Text tone="muted" size="sm">
            {gap}
          </Text>
          <Stack gap={gap}>
            <Card className="bg-inset size-10" padded={false} />
            <Card className="bg-inset size-10" padded={false} />
            <Card className="bg-inset size-10" padded={false} />
          </Stack>
        </Stack>
      ))}
    </Inline>
  )
}
