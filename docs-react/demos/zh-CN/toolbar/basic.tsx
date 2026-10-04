'use client'

import { useState } from 'react'
import { Copy, Download, RotateCcw } from 'lucide-react'
import { Toolbar, ToolbarButton, ToolbarLink, ToolbarSeparator, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [action, setAction] = useState('尚未执行')

  return (
    <Stack align="start" gap="sm">
      <Toolbar label="操作" size="sm">
        <ToolbarButton onClick={() => setAction('复制')} icon={<Copy />}>
          复制
        </ToolbarButton>
        <ToolbarButton onClick={() => setAction('下载')} icon={<Download />}>
          下载
        </ToolbarButton>
        <ToolbarButton onClick={() => setAction('重置')} icon={<RotateCcw />}>
          重置
        </ToolbarButton>
        <ToolbarSeparator />
        <ToolbarLink href="#api">API</ToolbarLink>
      </Toolbar>
      <Text size="sm" tone="muted" aria-live="polite">
        {action}
      </Text>
    </Stack>
  )
}
