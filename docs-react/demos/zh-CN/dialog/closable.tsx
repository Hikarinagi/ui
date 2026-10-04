'use client'

import { Button, Dialog, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Dialog
      title="无关闭按钮"
      closable={false}
      renderContent={() => <Text>按 Esc、点击遮罩或底部按钮均可关闭。</Text>}
      renderFooter={({ close }) => <Button onClick={close}>关闭</Button>}
    >
      <Button variant="outline" tone="neutral">
        无关闭按钮
      </Button>
    </Dialog>
  )
}
