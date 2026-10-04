import { Copy, Download, Pencil, Trash2 } from 'lucide-react'
import {
  Button,
  DisclosureIcon,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="File actions"
      align="start"
      content={
        <>
          <DropdownMenuItem icon={<Pencil />}>Rename</DropdownMenuItem>
          <DropdownMenuItem icon={<Copy />}>Copy</DropdownMenuItem>
          <DropdownMenuItem icon={<Download />}>Download</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem tone="danger" icon={<Trash2 />}>
            Delete
          </DropdownMenuItem>
        </>
      }
    >
      <Button variant="outline" tone="neutral" trailing={<DisclosureIcon />}>
        File
      </Button>
    </DropdownMenu>
  )
}
