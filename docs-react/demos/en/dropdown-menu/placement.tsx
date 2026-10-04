import { Button, DropdownMenu, DropdownMenuItem, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <DropdownMenu
        label="Aligned to the start"
        align="start"
        content={
          <>
            <DropdownMenuItem>First item</DropdownMenuItem>
            <DropdownMenuItem>Second item</DropdownMenuItem>
          </>
        }
      >
        <Button variant="outline" tone="neutral">
          start
        </Button>
      </DropdownMenu>
      <DropdownMenu
        label="Centred"
        align="center"
        content={
          <>
            <DropdownMenuItem>First item</DropdownMenuItem>
            <DropdownMenuItem>Second item</DropdownMenuItem>
          </>
        }
      >
        <Button variant="outline" tone="neutral">
          center
        </Button>
      </DropdownMenu>
      <DropdownMenu
        label="Opening to the right"
        side="right"
        align="start"
        content={
          <>
            <DropdownMenuItem>First item</DropdownMenuItem>
            <DropdownMenuItem>Second item</DropdownMenuItem>
          </>
        }
      >
        <Button variant="outline" tone="neutral">
          right
        </Button>
      </DropdownMenu>
    </Inline>
  )
}
