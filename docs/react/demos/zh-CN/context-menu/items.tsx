import { Copy, Pencil, Trash2 } from 'lucide-react'
import {
  Center,
  ContextMenu,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  Kbd,
  Text,
} from '@hina-ui/react'

export default function Demo() {
  return (
    <ContextMenu
      label="条目操作"
      content={
        <>
          <ContextMenuLabel>这条笔记</ContextMenuLabel>
          <ContextMenuItem icon={<Pencil />} trailing={<Kbd>E</Kbd>}>
            编辑
          </ContextMenuItem>
          <ContextMenuItem icon={<Copy />} trailing={<Kbd>⌘C</Kbd>}>
            复制
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem tone="danger" icon={<Trash2 />}>
            删除
          </ContextMenuItem>
        </>
      }
    >
      <Center className="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
        <Text tone="muted" size="sm">
          在这里点击右键
        </Text>
      </Center>
    </ContextMenu>
  )
}
