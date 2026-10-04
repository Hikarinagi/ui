'use client'

import { Button, Sheet, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Sheet
      title="没有把手"
      description="右上角改为关闭按钮，标题区域仍然可以拖动。"
      handle={false}
      renderContent={() => <Text>按住标题向下拖动试试。</Text>}
    >
      <Button variant="outline" tone="neutral">
        打开
      </Button>
    </Sheet>
  )
}
