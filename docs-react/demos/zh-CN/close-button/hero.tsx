import { Card, CloseButton, Heading, Inline, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card padded className="w-full max-w-sm">
      <Inline align="start" justify="between" wrap={false} className="gap-4">
        <Stack gap="xs">
          <Heading level={3} size="sm">
            有新版本可用
          </Heading>
          <Text tone="muted" size="sm">
            刷新页面后即可使用最新功能。
          </Text>
        </Stack>
        <CloseButton className="-mt-1.5 -me-1.5 shrink-0" />
      </Inline>
    </Card>
  )
}
