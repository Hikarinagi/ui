import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react'
import { ButtonGroup, IconButton } from '@hina-ui/react'

export default function Demo() {
  return (
    <ButtonGroup label="Alignment">
      <IconButton label="Align left" variant="outline">
        <AlignLeft />
      </IconButton>
      <IconButton label="Align center" variant="outline">
        <AlignCenter />
      </IconButton>
      <IconButton label="Align right" variant="outline">
        <AlignRight />
      </IconButton>
    </ButtonGroup>
  )
}
