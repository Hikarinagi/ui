import { Button, Inline, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack>
      <Inline>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Inline>
      <Inline data-density="compact">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Inline>
    </Stack>
  )
}
