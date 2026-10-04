import { Button, Tooltip } from '@hina-ui/react'

export default function Demo() {
  return (
    <Tooltip content="Publishes as soon as it is saved">
      <Button variant="outline" tone="neutral">
        Publish
      </Button>
    </Tooltip>
  )
}
