import { Button, Card, Divider, Input, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full max-w-sm">
      <Stack>
        <Stack gap="xs">
          <Text size="sm">Email</Text>
          <Input defaultValue="shion@hikarinagi.moe" />
        </Stack>
        <Button>Sign in with email</Button>
        <Divider>or</Divider>
        <Button variant="outline" tone="neutral">
          Use a passkey
        </Button>
      </Stack>
    </Card>
  )
}
