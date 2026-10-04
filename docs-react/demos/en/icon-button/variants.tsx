import { Settings, Trash2 } from 'lucide-react'
import { IconButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <IconButton label="Settings" variant="solid" tone="accent">
        <Settings />
      </IconButton>
      <IconButton label="Settings" variant="soft">
        <Settings />
      </IconButton>
      <IconButton label="Settings" variant="outline">
        <Settings />
      </IconButton>
      <IconButton label="Settings">
        <Settings />
      </IconButton>
      <IconButton label="Delete" variant="soft" tone="danger">
        <Trash2 />
      </IconButton>
    </Inline>
  )
}
