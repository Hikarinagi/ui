'use client'

import { Button, Sheet, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Sheet
      title="无关闭按钮"
      closable={false}
      handle={false}
      renderContent={() => <Text>按 Esc、点击遮罩或底部按钮均可关闭。</Text>}
      renderFooter={({ close }) => <Button onClick={close}>关闭</Button>}
    >
      <Button variant="outline" tone="neutral">
        无关闭按钮
      </Button>
    </Sheet>
  )
}
