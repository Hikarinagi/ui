import { Button, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Button>Save</Button>
      <Button variant="outline" tone="neutral">
        Cancel
      </Button>
    </Inline>
  )
}
