import { Copy, Scissors, Trash2 } from 'lucide-react'
import { Button, DropdownMenu, DropdownMenuItem, Kbd } from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="编辑"
      content={
        <>
          <DropdownMenuItem icon={<Copy />} trailing={<Kbd>Ctrl C</Kbd>}>
            复制
          </DropdownMenuItem>
          <DropdownMenuItem icon={<Scissors />} trailing={<Kbd>Ctrl X</Kbd>}>
            剪切
          </DropdownMenuItem>
          <DropdownMenuItem tone="danger" icon={<Trash2 />} trailing={<Kbd>Del</Kbd>}>
            删除
          </DropdownMenuItem>
        </>
      }
    >
      <Button variant="outline" tone="neutral">
        编辑
      </Button>
    </DropdownMenu>
  )
}
