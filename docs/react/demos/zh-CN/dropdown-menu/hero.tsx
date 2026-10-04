import { Copy, Download, Pencil, Trash2 } from 'lucide-react'
import {
  Button,
  DisclosureIcon,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="文件操作"
      align="start"
      content={
        <>
          <DropdownMenuItem icon={<Pencil />}>重命名</DropdownMenuItem>
          <DropdownMenuItem icon={<Copy />}>复制</DropdownMenuItem>
          <DropdownMenuItem icon={<Download />}>下载</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem tone="danger" icon={<Trash2 />}>
            删除
          </DropdownMenuItem>
        </>
      }
    >
      <Button variant="outline" tone="neutral" trailing={<DisclosureIcon />}>
        文件
      </Button>
    </DropdownMenu>
  )
}
