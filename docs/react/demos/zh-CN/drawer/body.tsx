'use client'

import { Button, CloseButton, Inline, Drawer, ScrollArea, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Drawer
      title="自定义布局"
      description="标题与说明仍保留为无障碍内容。"
      renderBody={({ close }) => (
        <Stack gap="none" className="min-h-0 flex-1">
          <Inline
            justify="between"
            wrap={false}
            className="border-line bg-inset shrink-0 gap-3 border-b p-4"
          >
            <Stack gap="xs" className="min-w-0">
              <Text weight="medium">自定义布局</Text>
              <Text size="sm" tone="muted">
                标题栏、滚动区域和底栏均由插槽提供。
              </Text>
            </Stack>
            <CloseButton onClick={close} />
          </Inline>
          <ScrollArea className="min-h-0 flex-1">
            <Stack gap="none" className="divide-line divide-y px-4">
              {Array.from({ length: 30 }, (_, i) => i + 1).map(index => (
                <Text key={index} className="py-3">
                  内容 {index}
                </Text>
              ))}
            </Stack>
          </ScrollArea>
          <Inline
            justify="between"
            wrap={false}
            className="border-line shrink-0 gap-3 border-t p-4 pb-[max(var(--hn-panel-p),env(safe-area-inset-bottom))]"
          >
            <Text size="sm" tone="muted">
              底栏保持可见
            </Text>
            <Button size="sm" onClick={close}>
              完成
            </Button>
          </Inline>
        </Stack>
      )}
    >
      <Button variant="outline" tone="neutral">
        自定义面板
      </Button>
    </Drawer>
  )
}
