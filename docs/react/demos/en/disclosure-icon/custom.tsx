import { Plus } from 'lucide-react'
import { Button, DisclosureIcon, DropdownMenu, DropdownMenuItem } from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="Add to"
      content={
        <>
          <DropdownMenuItem>Want to read</DropdownMenuItem>
          <DropdownMenuItem>Reading</DropdownMenuItem>
          <DropdownMenuItem>Read</DropdownMenuItem>
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
        Add to
      </Button>
    </DropdownMenu>
  )
}
