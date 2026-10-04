'use client'

import { useCallback, useState } from 'react'
import { Button, Drawer, Stack, Text, type DrawerHandle } from '@hina-ui/react'

export default function Demo() {
  const [viewport, setViewport] = useState<HTMLElement>()
  const modal = useCallback((handle: DrawerHandle | null) => setViewport(handle?.viewport), [])

  function scrollTo(position: 'start' | 'end') {
    if (!viewport) return
    viewport.scrollTo({ top: position === 'start' ? 0 : viewport.scrollHeight })
  }

  return (
    <Drawer
      ref={modal}
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
            disabled={!viewport}
            onClick={() => scrollTo('start')}
          >
            顶部
          </Button>
          <Button
            variant="soft"
            tone="neutral"
            disabled={!viewport}
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
    </Drawer>
  )
}
