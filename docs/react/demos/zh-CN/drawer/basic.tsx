'use client'

import { Button, Drawer, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Drawer
      title="通知"
      description="最近七天的消息。"
      renderContent={() => <Text>这里放置消息列表，抽屉贴着屏幕边缘展开，四角保持直角。</Text>}
    >
      <Button variant="outline" tone="neutral">
        打开通知
      </Button>
    </Drawer>
  )
}
