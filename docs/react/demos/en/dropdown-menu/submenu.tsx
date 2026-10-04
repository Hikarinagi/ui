import { Download, Share2 } from 'lucide-react'
import {
  Button,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
} from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="File actions"
      align="start"
      content={
        <>
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuSub label="Share with" icon={<Share2 />}>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
            <DropdownMenuItem>Send by email</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Invite a collaborator</DropdownMenuItem>
          </DropdownMenuSub>
          <DropdownMenuSub label="Export as" icon={<Download />}>
            <DropdownMenuItem>PDF</DropdownMenuItem>
            <DropdownMenuItem>EPUB</DropdownMenuItem>
            <DropdownMenuItem>Plain text</DropdownMenuItem>
          </DropdownMenuSub>
        </>
      }
    >
      <Button variant="outline" tone="neutral">
        File
      </Button>
    </DropdownMenu>
  )
}
