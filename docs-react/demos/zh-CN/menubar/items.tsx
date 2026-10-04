import { Copy, FilePlus, Trash2 } from 'lucide-react'
import {
  Kbd,
  Menubar,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
} from '@hina-ui/react'

export default function Demo() {
  return (
    <Menubar label="条目示例">
      <MenubarMenu label="文件">
        <MenubarLabel>当前文档</MenubarLabel>
        <MenubarItem icon={<FilePlus />} trailing={<Kbd>Ctrl N</Kbd>}>
          新建
        </MenubarItem>
        <MenubarItem icon={<Copy />}>复制一份</MenubarItem>
        <MenubarSeparator />
        <MenubarItem tone="danger" icon={<Trash2 />}>
          删除
        </MenubarItem>
      </MenubarMenu>
    </Menubar>
  )
}
