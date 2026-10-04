'use client'

import { Copy, Moon, PenLine, Trash2 } from 'lucide-react'
import { Button, CommandPalette, type CommandItems } from '@hina-ui/react'

const items: CommandItems = [
  { id: 'review', label: '新建书评', icon: PenLine, kbd: ['⌘', 'N'] },
  { id: 'copy', label: '复制链接', icon: Copy, kbd: ['⌘', 'C'] },
  { id: 'theme', label: '切换主题', icon: Moon, kbd: ['⌘', 'D'] },
  { id: 'delete', label: '删除书评', icon: Trash2, disabled: true },
]

export default function Demo() {
  return (
    <CommandPalette items={items}>
      <Button variant="outline" tone="neutral">
        操作
      </Button>
    </CommandPalette>
  )
}
