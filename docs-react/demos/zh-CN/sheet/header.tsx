'use client'

import { Button, Inline, Sheet, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      {[true, false].map(handle => (
        <Sheet
          key={String(handle)}
          title="隐藏标题栏"
          description="标题与说明仍保留为无障碍内容。"
          header={false}
          handle={handle}
          renderContent={() => <Text>正文直接显示在把手下方，或从面板内边距开始。</Text>}
          renderFooter={({ close }) => (
            <Button variant="soft" tone="neutral" onClick={close}>
              关闭
            </Button>
          )}
        >
          <Button variant="outline" tone="neutral">
            {handle ? '保留把手' : '隐藏整个顶部'}
          </Button>
        </Sheet>
      ))}
    </Inline>
  )
}
