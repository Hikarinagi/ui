'use client'

import { Button, Drawer, Stack, Text } from '@hina-ui/react'

const items = Array.from(
  { length: 30 },
  (_, i) => `第 ${i + 1} 条通知：这是一段用于占位的文字，好让正文足够长，能够看到滚动。`,
)

export default function Demo() {
  return (
    <Drawer
      title="全部通知"
      description="标题与页脚固定，中间的列表可以滚动。"
      renderContent={() => (
        <Stack gap="sm">
          {items.map(item => (
            <Text key={item}>{item}</Text>
          ))}
        </Stack>
      )}
      renderFooter={({ close }) => (
        <Button variant="soft" tone="neutral" onClick={close}>
          全部标为已读
        </Button>
      )}
    >
      <Button variant="outline" tone="neutral">
        查看全部
      </Button>
    </Drawer>
  )
}
