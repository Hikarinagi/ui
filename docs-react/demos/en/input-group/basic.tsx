import { AtSign } from 'lucide-react'
import { Input, InputGroup, InputGroupAddon, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-80">
      <InputGroup>
        <InputGroupAddon>
          <AtSign />
        </InputGroupAddon>
        <Input defaultValue="" aria-label="Username" placeholder="Username" />
      </InputGroup>
      <InputGroup>
        <Input defaultValue="" inputMode="decimal" aria-label="Amount" placeholder="Amount" />
        <InputGroupAddon>CNY</InputGroupAddon>
      </InputGroup>
    </Stack>
  )
}
