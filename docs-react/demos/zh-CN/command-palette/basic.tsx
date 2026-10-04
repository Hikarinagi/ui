'use client'

import { useState } from 'react'
import { Button, CommandPalette, Stack, Text, type CommandItems } from '@hina-ui/react'

const items: CommandItems = [
  { id: 'home', label: '首页' },
  { id: 'library', label: '书架' },
  { id: 'bookmarks', label: '收藏' },
  { id: 'settings', label: '设置' },
]

export default function Demo() {
  const [picked, setPicked] = useState('')

  return (
    <Stack gap="md" align="start">
      <CommandPalette items={items} onSelect={item => setPicked(item.label)}>
        <Button variant="outline" tone="neutral">
          打开面板
        </Button>
      </CommandPalette>
      {picked && (
        <Text size="sm" tone="muted">
          已选择：{picked}
        </Text>
      )}
    </Stack>
  )
}
