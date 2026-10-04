import { ArrowRight, Save } from 'lucide-react'
import { Button, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Button loading>保存</Button>
      <Button loading variant="soft" icon={<Save />}>
        保存
      </Button>
      <Button loading variant="outline" tone="neutral" trailing={<ArrowRight />}>
        下一步
      </Button>
    </Inline>
  )
}
