import { Settings, Trash2 } from 'lucide-react'
import { IconButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <IconButton label="设置" variant="solid" tone="accent">
        <Settings />
      </IconButton>
      <IconButton label="设置" variant="soft">
        <Settings />
      </IconButton>
      <IconButton label="设置" variant="outline">
        <Settings />
      </IconButton>
      <IconButton label="设置">
        <Settings />
      </IconButton>
      <IconButton label="删除" variant="soft" tone="danger">
        <Trash2 />
      </IconButton>
    </Inline>
  )
}
