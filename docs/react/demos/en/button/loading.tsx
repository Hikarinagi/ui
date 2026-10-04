import { ArrowRight, Save } from 'lucide-react'
import { Button, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Button loading>Save</Button>
      <Button loading variant="soft" icon={<Save />}>
        Save
      </Button>
      <Button loading variant="outline" tone="neutral" trailing={<ArrowRight />}>
        Next
      </Button>
    </Inline>
  )
}
