'use client'

import { useState } from 'react'
import { Button, CommandPalette, Inline, Text, type CommandItems } from '@hina-ui/react'

const items: CommandItems = [
  { id: 'home', label: '首页' },
  { id: 'library', label: '书架' },
  { id: 'settings', label: '设置' },
]

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <Inline gap="md" align="center">
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        从外部打开
      </Button>
      <Text size="sm" tone="muted">
        {open ? '已打开' : '已关闭'}
      </Text>
      <CommandPalette open={open} onOpenChange={setOpen} items={items} />
    </Inline>
  )
}
