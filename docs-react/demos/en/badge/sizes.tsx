import { Bell } from 'lucide-react'
import { Badge, IconButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Badge content={8} size="sm">
        <IconButton label="Notifications" variant="soft">
          <Bell />
        </IconButton>
      </Badge>
      <Badge content={8} size="md">
        <IconButton label="Notifications" variant="soft">
          <Bell />
        </IconButton>
      </Badge>
    </Inline>
  )
}
