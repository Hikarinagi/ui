import { Input, InputGroup, InputGroupAddon } from '@hina-ui/react'

export default function Demo() {
  return (
    <InputGroup className="w-80">
      <InputGroupAddon>https://</InputGroupAddon>
      <Input defaultValue="shion" aria-label="Site name" />
      <InputGroupAddon>.hoshimi.moe</InputGroupAddon>
    </InputGroup>
  )
}
