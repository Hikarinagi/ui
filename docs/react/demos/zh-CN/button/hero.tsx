import { Send } from 'lucide-react'
import { Button, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Button variant="ghost" tone="neutral">
        取消
      </Button>
      <Button variant="outline" tone="neutral">
        存为草稿
      </Button>
      <Button icon={<Send />}>发布</Button>
    </Inline>
  )
}
