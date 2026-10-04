import { Button, Card, Heading, Input, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full max-w-sm">
      <Stack>
        <Stack gap="xs">
          <Heading level={3} size="md">
            创建书单
          </Heading>
          <Text tone="muted" size="sm">
            书单创建之后可以随时添加作品。
          </Text>
        </Stack>
        <Stack gap="xs">
          <Text size="sm">名称</Text>
          <Input defaultValue="今年读过的轻小说" />
        </Stack>
        <Button>创建</Button>
      </Stack>
    </Card>
  )
}
