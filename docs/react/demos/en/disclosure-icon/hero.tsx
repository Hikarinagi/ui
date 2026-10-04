import { Button, DisclosureIcon, DropdownMenu, DropdownMenuItem } from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="Sort by"
      content={
        <>
          <DropdownMenuItem>Recently updated</DropdownMenuItem>
          <DropdownMenuItem>Release date</DropdownMenuItem>
          <DropdownMenuItem>Most saved</DropdownMenuItem>
        </>
      }
    >
      <Button variant="outline" tone="neutral" trailing={<DisclosureIcon />}>
        Recently updated
      </Button>
    </DropdownMenu>
  )
}
