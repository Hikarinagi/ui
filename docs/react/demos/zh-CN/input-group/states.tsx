import { Input, InputGroup, InputGroupAddon, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-80">
      <InputGroup invalid>
        <InputGroupAddon>https://</InputGroupAddon>
        <Input defaultValue="not a domain" aria-label="校验未通过" />
      </InputGroup>
      <InputGroup disabled>
        <InputGroupAddon>https://</InputGroupAddon>
        <Input defaultValue="shion.hoshimi.moe" aria-label="已禁用" />
      </InputGroup>
    </Stack>
  )
}
