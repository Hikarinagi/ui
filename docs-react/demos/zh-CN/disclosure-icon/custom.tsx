import { Plus } from 'lucide-react'
import { Button, DisclosureIcon, DropdownMenu, DropdownMenuItem } from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="添加"
      content={
        <>
          <DropdownMenuItem>想读</DropdownMenuItem>
          <DropdownMenuItem>在读</DropdownMenuItem>
          <DropdownMenuItem>读过</DropdownMenuItem>
        </>
      }
    >
      <Button
        variant="outline"
        tone="neutral"
        trailing={
          <DisclosureIcon direction="end">
            <Plus />
          </DisclosureIcon>
        }
      >
        添加到
      </Button>
    </DropdownMenu>
  )
}
