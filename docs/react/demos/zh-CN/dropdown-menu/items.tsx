import { ExternalLink, Pencil, Share2, Trash2 } from 'lucide-react'
import { Button, DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="条目"
      content={
        <>
          <DropdownMenuItem icon={<Pencil />}>编辑</DropdownMenuItem>
          <DropdownMenuItem
            icon={<Share2 />}
            trailing={<ExternalLink className="text-faint size-3.5" />}
          >
            分享
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem tone="danger" icon={<Trash2 />}>
            删除
          </DropdownMenuItem>
        </>
      }
    >
      <Button variant="outline" tone="neutral">
        条目
      </Button>
    </DropdownMenu>
  )
}
