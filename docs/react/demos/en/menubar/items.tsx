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
    <Menubar label="Item example">
      <MenubarMenu label="File">
        <MenubarLabel>This document</MenubarLabel>
        <MenubarItem icon={<FilePlus />} trailing={<Kbd>Ctrl N</Kbd>}>
          New
        </MenubarItem>
        <MenubarItem icon={<Copy />}>Duplicate</MenubarItem>
        <MenubarSeparator />
        <MenubarItem tone="danger" icon={<Trash2 />}>
          Delete
        </MenubarItem>
      </MenubarMenu>
    </Menubar>
  )
}
