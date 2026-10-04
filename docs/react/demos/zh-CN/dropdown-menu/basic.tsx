import { Button, DropdownMenu, DropdownMenuItem } from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="更多操作"
      content={
        <>
          <DropdownMenuItem>编辑</DropdownMenuItem>
          <DropdownMenuItem>复制</DropdownMenuItem>
          <DropdownMenuItem>归档</DropdownMenuItem>
        </>
      }
    >
      <Button variant="outline" tone="neutral">
        更多操作
      </Button>
    </DropdownMenu>
  )
}
