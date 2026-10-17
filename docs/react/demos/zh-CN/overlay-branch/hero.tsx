'use client'

import { useState } from 'react'
import { Button, Card, Drawer, OverlayBranch, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(0)

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="阅读设置"
        renderContent={() => (
          <Text tone="muted">左下角的卡片在抽屉外面。点它的按钮，抽屉保持打开。</Text>
        )}
      >
        <Button variant="outline" tone="neutral">
          打开抽屉
        </Button>
      </Drawer>
      {open && (
        <OverlayBranch className="fixed start-4 bottom-4 z-[calc(var(--hn-z-overlay)+1)] w-56">
          <Card className="flex flex-col gap-2 p-3 shadow-lg">
            <Text size="sm" tone="muted">
              外部图层
            </Text>
            <Button size="sm" onClick={() => setCount(value => value + 1)}>
              已点击 {count} 次
            </Button>
          </Card>
        </OverlayBranch>
      )}
    </>
  )
}
