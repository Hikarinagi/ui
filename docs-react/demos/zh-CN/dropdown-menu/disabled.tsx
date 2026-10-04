import { Button, DropdownMenu, DropdownMenuItem } from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="导出"
      content={
        <>
          <DropdownMenuItem>导出为 PDF</DropdownMenuItem>
          <DropdownMenuItem disabled>导出为 EPUB</DropdownMenuItem>
          <DropdownMenuItem>导出为纯文本</DropdownMenuItem>
        </>
      }
    >
      <Button variant="outline" tone="neutral">
        导出
      </Button>
    </DropdownMenu>
  )
}
