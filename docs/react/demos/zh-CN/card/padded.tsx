import { Card, Heading, Image, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card padded={false} className="w-full max-w-sm overflow-hidden">
      <Image src="/sample.webp" alt="夏日午后的坡道" className="h-32 w-full" />
      <Stack gap="xs" className="p-[var(--hn-panel-p)]">
        <Heading level={3} size="base">
          通向车站的那条坡道
        </Heading>
        <Text tone="muted" size="sm">
          图片贴合卡片边缘，内边距改由内部容器提供。
        </Text>
      </Stack>
    </Card>
  )
}
