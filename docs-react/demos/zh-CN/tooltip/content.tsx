import { Info, Save } from 'lucide-react'
import { IconButton, Inline, Kbd, Tooltip } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Tooltip
        content={
          <Inline align="center" className="gap-1.5">
            保存草稿
            <Kbd>Ctrl S</Kbd>
          </Inline>
        }
      >
        <IconButton label="保存" variant="outline" tooltip={false}>
          <Save />
        </IconButton>
      </Tooltip>
      <Tooltip content="这段说明比较长，超过气泡的最大宽度之后会自动折成多行，不会一直往外撑。">
        <IconButton label="说明" variant="outline" tooltip={false}>
          <Info />
        </IconButton>
      </Tooltip>
    </Inline>
  )
}
