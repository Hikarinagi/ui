import { Bell } from 'lucide-react'
import { Badge, IconButton } from '@hina-ui/react'

export default function Demo() {
  return (
    <Badge content={5} label="5 unread">
      <IconButton label="Notifications" variant="soft">
        <Bell />
      </IconButton>
    </Badge>
  )
}
