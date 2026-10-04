import { Card, Inline, Space, Stack, Text } from '@hina-ui/react'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export default function Demo() {
  return (
    <Stack>
      {sizes.map(size => (
        <Stack key={size} gap="xs">
          <Text tone="muted" size="sm">
            {size}
          </Text>
          <Inline gap="none" className="bg-inset w-fit rounded-md p-2">
            <Card className="bg-surface size-8" padded={false} />
            <Space size={size} />
            <Card className="bg-surface size-8" padded={false} />
          </Inline>
        </Stack>
      ))}
    </Stack>
  )
}
