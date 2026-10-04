import { Button, DisclosureIcon, DropdownMenu, DropdownMenuItem } from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="排序方式"
      content={
        <>
          <DropdownMenuItem>按更新时间</DropdownMenuItem>
          <DropdownMenuItem>按发行日期</DropdownMenuItem>
          <DropdownMenuItem>按收藏数</DropdownMenuItem>
        </>
      }
    >
      <Button variant="outline" tone="neutral" trailing={<DisclosureIcon />}>
        按更新时间
      </Button>
    </DropdownMenu>
  )
}
