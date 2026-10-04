import { Copy } from 'lucide-react'
import { Button, IconButton, Input, InputGroup, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-80">
      <InputGroup>
        <Input defaultValue="HINA-2026" readOnly aria-label="邀请码" />
        <IconButton label="复制" variant="outline" tone="neutral">
          <Copy />
        </IconButton>
      </InputGroup>
      <InputGroup>
        <Input defaultValue="" type="email" aria-label="邮箱" placeholder="邮箱" />
        <Button>订阅</Button>
      </InputGroup>
    </Stack>
  )
}
