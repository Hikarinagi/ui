import { Avatar, Badge, Inline, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="start" className="gap-8">
      <Stack gap="xs" align="center">
        <Badge content={4}>
          <Avatar size="lg" src="/avatars/peek.webp" alt="星见书音" />
        </Badge>
        <Text tone="muted" size="sm">
          rect
        </Text>
      </Stack>
      <Stack gap="xs" align="center">
        <Badge content={4} shape="circle">
          <Avatar size="lg" src="/avatars/peek.webp" alt="星见书音" />
        </Badge>
        <Text tone="muted" size="sm">
          circle
        </Text>
      </Stack>
    </Inline>
  )
}
