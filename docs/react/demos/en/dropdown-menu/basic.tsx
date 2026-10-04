import { Button, DropdownMenu, DropdownMenuItem } from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="More actions"
      content={
        <>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem>Archive</DropdownMenuItem>
        </>
      }
    >
      <Button variant="outline" tone="neutral">
        More actions
      </Button>
    </DropdownMenu>
  )
}
