'use client'

import { useState } from 'react'
import { Button, Drawer, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <Inline align="center">
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        从外部打开
      </Button>
      <Text tone="muted" size="sm">
        当前：{open ? '已打开' : '已关闭'}
      </Text>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="没有触发器的抽屉"
        description="它由外部的状态控制。"
        renderContent={() => <Text>省略默认插槽时不渲染触发器，只能通过 open 打开。</Text>}
        renderFooter={({ close }) => <Button onClick={close}>关闭</Button>}
      />
    </Inline>
  )
}
