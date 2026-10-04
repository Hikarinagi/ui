import { ArrowRight, Plus, Settings } from 'lucide-react'
import { Button, IconButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Button icon={<Plus />}>New</Button>
      <Button variant="outline" tone="neutral" trailing={<ArrowRight />}>
        Next
      </Button>
      <IconButton label="Settings" variant="outline">
        <Settings />
      </IconButton>
    </Inline>
  )
}
