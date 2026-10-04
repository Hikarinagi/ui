'use client'

import { useState } from 'react'
import { Button, Inline, Popover, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <Inline align="center">
      <Popover
        open={open}
        onOpenChange={setOpen}
        content={
          <Stack gap="sm" className="w-56">
            <Text size="sm">这段内容可以从外部展开或者收起。</Text>
            <Button size="sm" variant="soft" tone="neutral" onClick={() => setOpen(false)}>
              知道了
            </Button>
          </Stack>
        }
      >
        <Button variant="outline" tone="neutral">
          详情
        </Button>
      </Popover>
      <Button size="sm" variant="soft" tone="neutral" onClick={() => setOpen(!open)}>
        从外部{open ? '收起' : '展开'}
      </Button>
      <Text tone="muted" size="sm">
        当前：{open ? '展开' : '收起'}
      </Text>
    </Inline>
  )
}
