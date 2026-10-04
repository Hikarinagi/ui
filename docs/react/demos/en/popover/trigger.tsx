import { Info } from 'lucide-react'
import { IconButton, Inline, Link, Popover, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Popover content={<Text size="sm">The trigger here is an icon button.</Text>}>
        <IconButton variant="ghost" tone="neutral" label="Show notes" tooltip={false}>
          <Info />
        </IconButton>
      </Popover>
      <Popover
        align="start"
        content={<Text size="sm">The trigger here is a piece of inline link text.</Text>}
      >
        <Link href="#">Shion Hoshimi</Link>
      </Popover>
    </Inline>
  )
}
