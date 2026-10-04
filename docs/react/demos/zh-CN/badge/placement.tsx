import { Bell } from 'lucide-react'
import { Badge, IconButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      {(['top-end', 'top-start', 'bottom-end', 'bottom-start'] as const).map(placement => (
        <Badge key={placement} content={2} placement={placement}>
          <IconButton label="通知" variant="soft">
            <Bell />
          </IconButton>
        </Badge>
      ))}
    </Inline>
  )
}
