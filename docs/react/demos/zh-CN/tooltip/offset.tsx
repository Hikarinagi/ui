import { Button, Inline, Tooltip } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Tooltip content="sideOffset 为 0" sideOffset={0}>
        <Button variant="outline" tone="neutral">
          紧贴
        </Button>
      </Tooltip>
      <Tooltip content="sideOffset 为 16" sideOffset={16}>
        <Button variant="outline" tone="neutral">
          远离
        </Button>
      </Tooltip>
    </Inline>
  )
}
