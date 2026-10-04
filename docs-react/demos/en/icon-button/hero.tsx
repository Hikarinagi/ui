import { Bookmark, Download, Pencil, Share2, Trash2 } from 'lucide-react'
import { IconButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <IconButton label="Edit">
        <Pencil />
      </IconButton>
      <IconButton label="Bookmark">
        <Bookmark />
      </IconButton>
      <IconButton label="Share">
        <Share2 />
      </IconButton>
      <IconButton label="Download">
        <Download />
      </IconButton>
      <IconButton label="Delete" tone="danger">
        <Trash2 />
      </IconButton>
    </Inline>
  )
}
