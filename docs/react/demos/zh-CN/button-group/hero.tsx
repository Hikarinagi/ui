import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react'
import { ButtonGroup, IconButton } from '@hina-ui/react'

export default function Demo() {
  return (
    <ButtonGroup label="对齐方式">
      <IconButton label="左对齐" variant="outline">
        <AlignLeft />
      </IconButton>
      <IconButton label="居中" variant="outline">
        <AlignCenter />
      </IconButton>
      <IconButton label="右对齐" variant="outline">
        <AlignRight />
      </IconButton>
    </ButtonGroup>
  )
}
