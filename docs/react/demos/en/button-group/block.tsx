import { Button, ButtonGroup } from '@hina-ui/react'

export default function Demo() {
  return (
    <ButtonGroup label="Vote" block>
      <Button variant="outline" tone="neutral">
        For
      </Button>
      <Button variant="outline" tone="neutral">
        Abstain
      </Button>
      <Button variant="outline" tone="neutral">
        Against
      </Button>
    </ButtonGroup>
  )
}
