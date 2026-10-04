import { Copy } from 'lucide-react'
import { Button, IconButton, Input, InputGroup, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-80">
      <InputGroup>
        <Input defaultValue="HINA-2026" readOnly aria-label="Invite code" />
        <IconButton label="Copy" variant="outline" tone="neutral">
          <Copy />
        </IconButton>
      </InputGroup>
      <InputGroup>
        <Input defaultValue="" type="email" aria-label="Email" placeholder="Email" />
        <Button>Subscribe</Button>
      </InputGroup>
    </Stack>
  )
}
