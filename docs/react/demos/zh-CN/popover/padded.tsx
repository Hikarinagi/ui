import { Button, Divider, Popover, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Popover
      padded={false}
      align="start"
      content={
        <Stack gap="none" className="w-64">
          <Stack gap="none" className="bg-inset px-4 py-3">
            <Text size="sm" className="font-medium">
              第 42 话
            </Text>
          </Stack>
          <Divider />
          <Stack gap="xs" className="px-4 py-3">
            <Text tone="muted" size="sm">
              作者：支倉凍砂
            </Text>
            <Text tone="muted" size="sm">
              更新于三小时前
            </Text>
          </Stack>
        </Stack>
      }
    >
      <Button variant="outline" tone="neutral">
        最近更新
      </Button>
    </Popover>
  )
}
