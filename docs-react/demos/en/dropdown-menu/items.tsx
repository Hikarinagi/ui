import { ExternalLink, Pencil, Share2, Trash2 } from 'lucide-react'
import { Button, DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="Items"
      content={
        <>
          <DropdownMenuItem icon={<Pencil />}>Edit</DropdownMenuItem>
          <DropdownMenuItem
            icon={<Share2 />}
            trailing={<ExternalLink className="text-faint size-3.5" />}
          >
            Share
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem tone="danger" icon={<Trash2 />}>
            Delete
          </DropdownMenuItem>
        </>
      }
    >
      <Button variant="outline" tone="neutral">
        Items
      </Button>
    </DropdownMenu>
  )
}
