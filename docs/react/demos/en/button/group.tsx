import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react'
import { Button, ButtonGroup, IconButton, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack align="center">
      <ButtonGroup label="Alignment">
        <IconButton label="Align left" variant="outline" tone="neutral">
          <AlignLeft />
        </IconButton>
        <IconButton label="Align center" variant="outline" tone="neutral">
          <AlignCenter />
        </IconButton>
        <IconButton label="Align right" variant="outline" tone="neutral">
          <AlignRight />
        </IconButton>
      </ButtonGroup>

      <ButtonGroup label="View" divider>
        <Button variant="soft" tone="neutral">
          List
        </Button>
        <Button variant="soft" tone="neutral">
          Grid
        </Button>
        <Button variant="soft" tone="neutral">
          Timeline
        </Button>
      </ButtonGroup>
    </Stack>
  )
}
