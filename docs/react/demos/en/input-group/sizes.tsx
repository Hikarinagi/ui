import { Button, Input, InputGroup, InputGroupAddon, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-80">
      <InputGroup size="sm">
        <InputGroupAddon>https://</InputGroupAddon>
        <Input aria-label="Small" />
        <Button size="sm">OK</Button>
      </InputGroup>
      <InputGroup size="md">
        <InputGroupAddon>https://</InputGroupAddon>
        <Input aria-label="Medium" />
        <Button size="md">OK</Button>
      </InputGroup>
      <InputGroup size="lg">
        <InputGroupAddon>https://</InputGroupAddon>
        <Input aria-label="Large" />
        <Button size="lg">OK</Button>
      </InputGroup>
    </Stack>
  )
}
