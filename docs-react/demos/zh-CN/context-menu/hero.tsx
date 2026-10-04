'use client'

import { useState } from 'react'
import { Copy, FolderInput, Pencil, Trash2 } from 'lucide-react'
import {
  Center,
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  Stack,
  Text,
} from '@hina-ui/react'

export default function Demo() {
  const [last, setLast] = useState('')

  return (
    <Stack gap="sm" align="stretch" className="w-96">
      <ContextMenu
        label="文件操作"
        content={
          <>
            <ContextMenuItem icon={<Pencil />} onSelect={() => setLast('重命名')}>
              重命名
            </ContextMenuItem>
            <ContextMenuItem icon={<Copy />} onSelect={() => setLast('复制')}>
              复制
            </ContextMenuItem>
            <ContextMenuSub label="移动到" icon={<FolderInput />}>
              <ContextMenuItem onSelect={() => setLast('移动到收藏夹')}>收藏夹</ContextMenuItem>
              <ContextMenuItem onSelect={() => setLast('移动到归档')}>归档</ContextMenuItem>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem tone="danger" icon={<Trash2 />} onSelect={() => setLast('删除')}>
              删除
            </ContextMenuItem>
          </>
        }
      >
        <Center className="bg-inset h-32 rounded-lg border border-dashed select-none">
          <Text tone="muted" size="sm">
            在这里点击右键
          </Text>
        </Center>
      </ContextMenu>
      {last && (
        <Text tone="muted" size="sm">
          选择了：{last}
        </Text>
      )}
    </Stack>
  )
}
