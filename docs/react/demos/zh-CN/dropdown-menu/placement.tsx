import { Button, DropdownMenu, DropdownMenuItem, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <DropdownMenu
        label="向下对齐起始边"
        align="start"
        content={
          <>
            <DropdownMenuItem>第一项</DropdownMenuItem>
            <DropdownMenuItem>第二项</DropdownMenuItem>
          </>
        }
      >
        <Button variant="outline" tone="neutral">
          start
        </Button>
      </DropdownMenu>
      <DropdownMenu
        label="向下居中"
        align="center"
        content={
          <>
            <DropdownMenuItem>第一项</DropdownMenuItem>
            <DropdownMenuItem>第二项</DropdownMenuItem>
          </>
        }
      >
        <Button variant="outline" tone="neutral">
          center
        </Button>
      </DropdownMenu>
      <DropdownMenu
        label="向右展开"
        side="right"
        align="start"
        content={
          <>
            <DropdownMenuItem>第一项</DropdownMenuItem>
            <DropdownMenuItem>第二项</DropdownMenuItem>
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
