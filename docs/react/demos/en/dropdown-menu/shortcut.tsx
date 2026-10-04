import { Copy, Scissors, Trash2 } from 'lucide-react'
import { Button, DropdownMenu, DropdownMenuItem, Kbd } from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="Edit"
      content={
        <>
          <DropdownMenuItem icon={<Copy />} trailing={<Kbd>Ctrl C</Kbd>}>
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem icon={<Scissors />} trailing={<Kbd>Ctrl X</Kbd>}>
            Cut
          </DropdownMenuItem>
          <DropdownMenuItem tone="danger" icon={<Trash2 />} trailing={<Kbd>Del</Kbd>}>
            Delete
          </DropdownMenuItem>
        </>
      }
    >
      <Button variant="outline" tone="neutral">
        Edit
      </Button>
    </DropdownMenu>
  )
}
