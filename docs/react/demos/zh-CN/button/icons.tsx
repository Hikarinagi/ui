import { ArrowRight, Plus, Settings } from 'lucide-react'
import { Button, IconButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Button icon={<Plus />}>新建</Button>
      <Button variant="outline" tone="neutral" trailing={<ArrowRight />}>
        下一步
      </Button>
      <IconButton label="设置" variant="outline">
        <Settings />
      </IconButton>
    </Inline>
  )
}
