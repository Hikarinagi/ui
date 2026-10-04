import { Bookmark, Check } from 'lucide-react'
import { Badge, IconButton } from '@hina-ui/react'

export default function Demo() {
  return (
    <Badge content={<Check className="size-3" />} tone="success" size="md" label="已完成">
      <IconButton label="收藏" variant="soft">
        <Bookmark />
      </IconButton>
    </Badge>
  )
}
