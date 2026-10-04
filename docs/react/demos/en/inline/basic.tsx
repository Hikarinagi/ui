import { Button, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Button variant="soft" tone="neutral">
        Save
      </Button>
      <Button variant="soft" tone="neutral">
        Save as
      </Button>
      <Button variant="soft" tone="neutral">
        Export
      </Button>
    </Inline>
  )
}
