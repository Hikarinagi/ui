import { Copy, Scissors, Trash2 } from 'lucide-react'
import { Button, ButtonGroup } from '@hina-ui/react'

export default function Demo() {
  return (
    <ButtonGroup label="File actions" orientation="vertical" divider>
      <Button variant="soft" tone="neutral" icon={<Copy />}>
        Copy
      </Button>
      <Button variant="soft" tone="neutral" icon={<Scissors />}>
        Cut
      </Button>
      <Button variant="soft" tone="neutral" icon={<Trash2 />}>
        Delete
      </Button>
    </ButtonGroup>
  )
}
