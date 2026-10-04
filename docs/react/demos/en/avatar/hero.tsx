import { Avatar, Card, Inline, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full max-w-sm">
      <Inline gap="sm">
        <Avatar size="lg" src="/avatars/selfie.webp" name="Shion Hoshimi" />
        <Stack gap="none">
          <Text className="font-medium">Shion Hoshimi</Text>
          <Text tone="muted" size="sm">
            Translated 128 light novels
          </Text>
        </Stack>
      </Inline>
    </Card>
  )
}
