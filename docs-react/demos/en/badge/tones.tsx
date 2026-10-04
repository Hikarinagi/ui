import { Bell } from 'lucide-react'
import { Badge, IconButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      {(['danger', 'accent', 'neutral', 'success', 'warning', 'info'] as const).map(tone => (
        <Badge key={tone} content={6} tone={tone}>
          <IconButton label="Notifications" variant="soft">
            <Bell />
          </IconButton>
        </Badge>
      ))}
    </Inline>
  )
}
