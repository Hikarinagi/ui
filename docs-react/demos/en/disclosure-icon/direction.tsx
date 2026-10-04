import { Button, DisclosureIcon, DropdownMenu, DropdownMenuItem, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <DropdownMenu
        label="Opens downwards"
        content={
          <>
            <DropdownMenuItem>Rests pointing down</DropdownMenuItem>
            <DropdownMenuItem>Turns a half circle</DropdownMenuItem>
          </>
        }
      >
        <Button variant="outline" tone="neutral" trailing={<DisclosureIcon />}>
          down
        </Button>
      </DropdownMenu>
      <DropdownMenu
        label="Opens a level"
        content={
          <>
            <DropdownMenuItem>Rests pointing to the line end</DropdownMenuItem>
            <DropdownMenuItem>Turns a quarter</DropdownMenuItem>
          </>
        }
      >
        <Button variant="outline" tone="neutral" trailing={<DisclosureIcon direction="end" />}>
          end
        </Button>
      </DropdownMenu>
    </Inline>
  )
}
