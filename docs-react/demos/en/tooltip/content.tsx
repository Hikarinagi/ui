import { Info, Save } from 'lucide-react'
import { IconButton, Inline, Kbd, Tooltip } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Tooltip
        content={
          <Inline align="center" className="gap-1.5">
            Save draft
            <Kbd>Ctrl S</Kbd>
          </Inline>
        }
      >
        <IconButton label="Save" variant="outline" tooltip={false}>
          <Save />
        </IconButton>
      </Tooltip>
      <Tooltip content="A note this long runs past the maximum width of the bubble, so it wraps onto several lines instead of stretching out.">
        <IconButton label="Notes" variant="outline" tooltip={false}>
          <Info />
        </IconButton>
      </Tooltip>
    </Inline>
  )
}
