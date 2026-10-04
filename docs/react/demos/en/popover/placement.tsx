import { Button, Inline, Popover, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Popover
        align="start"
        content={<Text size="sm">Lined up with the start edge of the trigger.</Text>}
      >
        <Button variant="outline" tone="neutral">
          start
        </Button>
      </Popover>
      <Popover align="center" content={<Text size="sm">Centred on the trigger.</Text>}>
        <Button variant="outline" tone="neutral">
          center
        </Button>
      </Popover>
      <Popover
        side="right"
        align="start"
        content={<Text size="sm">Opens to the right of the trigger.</Text>}
      >
        <Button variant="outline" tone="neutral">
          right
        </Button>
      </Popover>
      <Popover side="top" content={<Text size="sm">Opens above the trigger.</Text>}>
        <Button variant="outline" tone="neutral">
          top
        </Button>
      </Popover>
    </Inline>
  )
}
