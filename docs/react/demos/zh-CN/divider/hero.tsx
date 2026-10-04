import { Button, Card, Divider, Input, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full max-w-sm">
      <Stack>
        <Stack gap="xs">
          <Text size="sm">邮箱</Text>
          <Input defaultValue="shion@hikarinagi.moe" />
        </Stack>
        <Button>用邮箱登录</Button>
        <Divider>或者</Divider>
        <Button variant="outline" tone="neutral">
          使用通行密钥
        </Button>
      </Stack>
    </Card>
  )
}
