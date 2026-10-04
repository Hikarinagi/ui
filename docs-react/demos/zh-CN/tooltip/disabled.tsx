'use client'

import { useState } from 'react'
import { Button, Inline, Text, Tooltip } from '@hina-ui/react'

export default function Demo() {
  const [off, setOff] = useState(true)
  return (
    <Inline align="center">
      <Tooltip content="侧栏收起时才需要这句话" disabled={off}>
        <Button variant="outline" tone="neutral">
          悬停试试
        </Button>
      </Tooltip>
      <Button size="sm" variant="soft" tone="neutral" onClick={() => setOff(!off)}>
        {off ? '启用提示' : '禁用提示'}
      </Button>
      <Text tone="muted" size="sm">
        当前：{off ? '已禁用' : '已启用'}
      </Text>
    </Inline>
  )
}
