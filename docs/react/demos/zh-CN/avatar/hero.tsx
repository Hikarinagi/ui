import { Avatar, Card, Inline, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full max-w-sm">
      <Inline gap="sm">
        <Avatar size="lg" src="/avatars/selfie.webp" name="星见书音" />
        <Stack gap="none">
          <Text className="font-medium">星见书音</Text>
          <Text tone="muted" size="sm">
            翻译了 128 本轻小说
          </Text>
        </Stack>
      </Inline>
    </Card>
  )
}
