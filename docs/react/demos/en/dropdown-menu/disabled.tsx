import { Button, DropdownMenu, DropdownMenuItem } from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="Export"
      content={
        <>
          <DropdownMenuItem>Export as PDF</DropdownMenuItem>
          <DropdownMenuItem disabled>Export as EPUB</DropdownMenuItem>
          <DropdownMenuItem>Export as plain text</DropdownMenuItem>
        </>
      }
    >
      <Button variant="outline" tone="neutral">
        Export
      </Button>
    </DropdownMenu>
  )
}
