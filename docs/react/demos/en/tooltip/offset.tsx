import { Button, Inline, Tooltip } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Tooltip content="sideOffset is 0" sideOffset={0}>
        <Button variant="outline" tone="neutral">
          Flush
        </Button>
      </Tooltip>
      <Tooltip content="sideOffset is 16" sideOffset={16}>
        <Button variant="outline" tone="neutral">
          Further away
        </Button>
      </Tooltip>
    </Inline>
  )
}
