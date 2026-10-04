'use client'

import { Button, Dialog, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Dialog
      title="发布这篇文章"
      description="发布之后所有人都能看到它。"
      renderContent={() => <Text>文章会出现在你的主页与订阅者的时间线上。</Text>}
      renderFooter={({ close }) => (
        <>
          <Button variant="soft" tone="neutral" onClick={close}>
            再想想
          </Button>
          <Button onClick={close}>发布</Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral">
        发布
      </Button>
    </Dialog>
  )
}
