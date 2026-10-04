import { Bell } from 'lucide-react'
import { Badge, IconButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Badge content={9}>
        <IconButton label="Notifications" variant="solid" tone="accent" pill size="lg">
          <Bell />
        </IconButton>
      </Badge>
      <Badge content={9} outline={false}>
        <IconButton label="Notifications" variant="solid" tone="accent" pill size="lg">
          <Bell />
        </IconButton>
      </Badge>
    </Inline>
  )
}
