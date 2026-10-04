'use client'

import { useState } from 'react'
import { Bookmark, Home, Library, LogOut, Moon, PenLine, Search, Settings } from 'lucide-react'
import { Button, CommandPalette, Kbd, Stack, Text, type CommandItems } from '@hina-ui/react'

const items: CommandItems = [
  {
    label: '页面',
    items: [
      { id: 'home', label: '首页', icon: Home, keywords: ['home'] },
      { id: 'library', label: '书架', icon: Library, keywords: ['library'] },
      { id: 'bookmarks', label: '收藏', icon: Bookmark, keywords: ['bookmark'] },
      { id: 'settings', label: '设置', icon: Settings, keywords: ['settings'], kbd: ['⌘', ','] },
    ],
  },
  {
    label: '操作',
    items: [
      { id: 'review', label: '新建书评', icon: PenLine, description: '记录一本刚读完的书' },
      { id: 'theme', label: '切换主题', icon: Moon, kbd: ['⌘', 'D'] },
      { id: 'logout', label: '退出登录', icon: LogOut },
    ],
  },
]

export default function Demo() {
  const [picked, setPicked] = useState('')

  return (
    <Stack gap="md" align="start">
      <CommandPalette items={items} hotkey="mod+j" onSelect={item => setPicked(item.label)}>
        <Button variant="outline" tone="neutral" icon={<Search />}>
          搜索
          <Kbd>⌘J</Kbd>
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
