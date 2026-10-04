import { Send } from 'lucide-react'
import { Button, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Button variant="ghost" tone="neutral">
        Cancel
      </Button>
      <Button variant="outline" tone="neutral">
        Save draft
      </Button>
      <Button icon={<Send />}>Publish</Button>
    </Inline>
  )
}
