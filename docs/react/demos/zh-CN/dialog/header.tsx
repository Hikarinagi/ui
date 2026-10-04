'use client'

import { Button, Dialog, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Dialog
      title="无头部"
      header={false}
      renderContent={() => <Text>标题保留为无障碍名称，正文与页脚正常显示。</Text>}
      renderFooter={({ close }) => <Button onClick={close}>关闭</Button>}
    >
      <Button variant="outline" tone="neutral">
        无头部
      </Button>
    </Dialog>
  )
}
