import { Bell, Mail, MessageSquare } from 'lucide-react'
import { Badge, IconButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Badge content={3}>
        <IconButton label="通知" variant="soft">
          <Bell />
        </IconButton>
      </Badge>
      <Badge content={128} tone="accent">
        <IconButton label="私信" variant="soft">
          <Mail />
        </IconButton>
      </Badge>
      <Badge content="NEW" tone="success" size="md">
        <IconButton label="评论" variant="soft">
          <MessageSquare />
        </IconButton>
      </Badge>
    </Inline>
  )
}
