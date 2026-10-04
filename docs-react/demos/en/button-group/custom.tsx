import { Button, ButtonGroup } from '@hina-ui/react'

export default function Demo() {
  return (
    <ButtonGroup
      label="Sort"
      className="[&>*:first-child]:rounded-s-full [&>*:last-child]:rounded-e-full"
    >
      <Button variant="soft" tone="neutral" className="px-6">
        Newest
      </Button>
      <Button variant="soft" tone="neutral" className="px-6">
        Popular
      </Button>
      <Button variant="soft" tone="neutral" className="px-6">
        Rating
      </Button>
    </ButtonGroup>
  )
}
