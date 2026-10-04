import { ChevronDown } from 'lucide-react'
import { Button, ButtonGroup, IconButton } from '@hina-ui/react'

export default function Demo() {
  return (
    <ButtonGroup label="Publish">
      <Button>Publish now</Button>
      <IconButton label="More publish options" variant="solid" tone="accent">
        <ChevronDown />
      </IconButton>
    </ButtonGroup>
  )
}
