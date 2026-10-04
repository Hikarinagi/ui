import { Settings2 } from 'lucide-react'
import { Button, Heading, Input, Popover, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Popover
      align="start"
      content={
        <Stack gap="sm" className="w-60">
          <Stack gap="xs">
            <Heading level={4} size="sm">
              阅读设置
            </Heading>
            <Text tone="muted" size="sm">
              调整正文的宽度与行距。
            </Text>
          </Stack>
          <Stack gap="xs">
            <Text size="sm">正文宽度</Text>
            <Input defaultValue="720" size="sm" />
          </Stack>
          <Stack gap="xs">
            <Text size="sm">行距</Text>
            <Input defaultValue="1.8" size="sm" />
          </Stack>
          <Button size="sm">保存</Button>
        </Stack>
      }
    >
      <Button variant="outline" tone="neutral" icon={<Settings2 />}>
        阅读设置
      </Button>
    </Popover>
  )
}
