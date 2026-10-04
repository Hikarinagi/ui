import { Divider, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-sm">
      <Text tone="muted" size="sm">
        默认是语义分隔线，屏幕阅读器会读出分隔
      </Text>
      <Divider />
      <Text tone="muted" size="sm">
        decorative 的线只是装饰，不进无障碍树
      </Text>
      <Divider decorative />
    </Stack>
  )
}
