import { Button, DisclosureIcon, DropdownMenu, DropdownMenuItem, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <DropdownMenu
        label="向下展开"
        content={
          <>
            <DropdownMenuItem>静止时朝下</DropdownMenuItem>
            <DropdownMenuItem>展开时旋转半圈</DropdownMenuItem>
          </>
        }
      >
        <Button variant="outline" tone="neutral" trailing={<DisclosureIcon />}>
          down
        </Button>
      </DropdownMenu>
      <DropdownMenu
        label="向层级展开"
        content={
          <>
            <DropdownMenuItem>静止时朝向行末</DropdownMenuItem>
            <DropdownMenuItem>展开时旋转四分之一圈</DropdownMenuItem>
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
