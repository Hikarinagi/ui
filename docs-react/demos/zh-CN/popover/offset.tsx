import { Button, Inline, Popover, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Popover sideOffset={0} content={<Text size="sm">sideOffset 为 0。</Text>}>
        <Button variant="outline" tone="neutral">
          紧贴
        </Button>
      </Popover>
      <Popover sideOffset={16} content={<Text size="sm">sideOffset 为 16。</Text>}>
        <Button variant="outline" tone="neutral">
          远离
        </Button>
      </Popover>
    </Inline>
  )
}
