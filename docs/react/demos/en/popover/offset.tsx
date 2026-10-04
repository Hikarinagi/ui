import { Button, Inline, Popover, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Popover sideOffset={0} content={<Text size="sm">sideOffset is 0.</Text>}>
        <Button variant="outline" tone="neutral">
          Flush
        </Button>
      </Popover>
      <Popover sideOffset={16} content={<Text size="sm">sideOffset is 16.</Text>}>
        <Button variant="outline" tone="neutral">
          Further away
        </Button>
      </Popover>
    </Inline>
  )
}
