'use client'

import { useState } from 'react'
import { Button, Dialog, Stack, Text, type DialogHandle } from '@hina-ui/react'

export default function Demo() {
  const [modal, setModal] = useState<DialogHandle | null>(null)

  function scrollTo(position: 'start' | 'end') {
    const viewport = modal?.viewport
    if (!viewport) return
    viewport.scrollTo({ top: position === 'start' ? 0 : viewport.scrollHeight })
  }

  return (
    <Dialog
      ref={setModal}
      title="滚动容器"
      description="标题与页脚固定，正文独立滚动。"
      renderContent={() => (
        <Stack gap="sm">
          {Array.from({ length: 30 }, (_, i) => i + 1).map(index => (
            <Text key={index}>第 {index} 行：正文在中间滚动，标题与页脚保持不动。</Text>
          ))}
        </Stack>
      )}
      renderFooter={({ close }) => (
        <>
          <Button
            variant="soft"
            tone="neutral"
            disabled={!modal?.viewport}
            onClick={() => scrollTo('start')}
          >
            顶部
          </Button>
          <Button
            variant="soft"
            tone="neutral"
            disabled={!modal?.viewport}
            onClick={() => scrollTo('end')}
          >
            底部
          </Button>
          <Button onClick={close}>关闭</Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral">
        打开
      </Button>
    </Dialog>
  )
}
