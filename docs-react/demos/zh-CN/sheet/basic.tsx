'use client'

import { Button, Sheet, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Sheet
      title="筛选"
      description="只影响当前列表。"
      renderContent={() => <Text>把筛选条件放在这里。按住顶部的把手向下拖动可以关闭。</Text>}
      renderFooter={({ close }) => (
        <>
          <Button variant="soft" tone="neutral" onClick={close}>
            重置
          </Button>
          <Button onClick={close}>应用</Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral">
        打开筛选
      </Button>
    </Sheet>
  )
}
