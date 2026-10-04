'use client'

import { Button, Dialog, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Dialog
      title="导出数据"
      description="选择一种格式，导出当前的筛选结果。"
      renderContent={() => <Text tone="muted">右上角的关闭按钮由 Dialog 内置，无需重复添加。</Text>}
    >
      <Button variant="outline" tone="neutral">
        打开对话框
      </Button>
    </Dialog>
  )
}
