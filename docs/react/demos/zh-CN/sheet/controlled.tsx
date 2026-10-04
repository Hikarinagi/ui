'use client'

import { useState } from 'react'
import { Button, Inline, Sheet, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <Inline gap="sm">
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        从外部打开
      </Button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="已收藏"
        description="这篇文章已加入你的收藏。"
        renderContent={() => <Text>没有触发器的面板，由外部的按钮打开。</Text>}
        renderFooter={({ close }) => <Button onClick={close}>知道了</Button>}
      />
    </Inline>
  )
}
