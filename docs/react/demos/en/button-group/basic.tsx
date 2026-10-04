import { Button, ButtonGroup } from '@hina-ui/react'

export default function Demo() {
  return (
    <ButtonGroup label="View">
      <Button variant="outline" tone="neutral">
        List
      </Button>
      <Button variant="outline" tone="neutral">
        Grid
      </Button>
      <Button variant="outline" tone="neutral">
        Timeline
      </Button>
    </ButtonGroup>
  )
}
