import { AtSign } from 'lucide-react'
import { Input, InputGroup, InputGroupAddon, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-80">
      <InputGroup>
        <InputGroupAddon>
          <AtSign />
        </InputGroupAddon>
        <Input defaultValue="" aria-label="用户名" placeholder="用户名" />
      </InputGroup>
      <InputGroup>
        <Input defaultValue="" inputMode="decimal" aria-label="金额" placeholder="金额" />
        <InputGroupAddon>元</InputGroupAddon>
      </InputGroup>
    </Stack>
  )
}
