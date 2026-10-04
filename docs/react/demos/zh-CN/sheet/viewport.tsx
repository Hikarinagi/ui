'use client'

import { useRef } from 'react'
import { Button, Sheet, Stack, Text, type SheetHandle } from '@hina-ui/react'

const lines = Array.from({ length: 30 }, (_, i) => i + 1)

export default function Demo() {
  const modal = useRef<SheetHandle>(null)

  function scrollTo(position: 'start' | 'end') {
    const viewport = modal.current?.viewport
    if (!viewport) return
    viewport.scrollTo({ top: position === 'start' ? 0 : viewport.scrollHeight })
  }

  return (
    <Sheet
      ref={modal}
      title="滚动容器"
      description="标题与页脚固定，正文独立滚动。"
      renderContent={() => (
        <Stack gap="sm">
          {lines.map(index => (
            <Text key={index}>第 {index} 行：正文在中间滚动，标题与页脚保持不动。</Text>
          ))}
        </Stack>
      )}
      renderFooter={({ close }) => (
        <>
          <Button
            variant="soft"
            tone="neutral"
            disabled={!modal.current?.viewport}
            onClick={() => scrollTo('start')}
          >
            顶部
          </Button>
          <Button
            variant="soft"
            tone="neutral"
            disabled={!modal.current?.viewport}
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
    </Sheet>
  )
}
