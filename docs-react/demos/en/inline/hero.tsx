import { Avatar, Button, Card, Inline, Stack, Tag, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full max-w-md">
      <Inline justify="between">
        <Inline gap="sm">
          <Avatar size="lg" src="/avatars/selfie.webp" alt="Shion Hoshimi" />
          <Stack gap="none">
            <Text className="font-medium">Shion Hoshimi</Text>
            <Text tone="muted" size="sm">
              Translator
            </Text>
          </Stack>
        </Inline>
        <Inline gap="xs">
          <Tag>Verified</Tag>
          <Button size="sm" variant="soft" tone="neutral">
            Follow
          </Button>
        </Inline>
      </Inline>
    </Card>
  )
}
