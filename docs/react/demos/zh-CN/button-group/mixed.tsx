import { ChevronDown } from 'lucide-react'
import { Button, ButtonGroup, IconButton } from '@hina-ui/react'

export default function Demo() {
  return (
    <ButtonGroup label="发布">
      <Button>立即发布</Button>
      <IconButton label="更多发布选项" variant="solid" tone="accent">
        <ChevronDown />
      </IconButton>
    </ButtonGroup>
  )
}
