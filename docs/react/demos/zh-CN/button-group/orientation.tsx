import { Copy, Scissors, Trash2 } from 'lucide-react'
import { Button, ButtonGroup } from '@hina-ui/react'

export default function Demo() {
  return (
    <ButtonGroup label="文件操作" orientation="vertical" divider>
      <Button variant="soft" tone="neutral" icon={<Copy />}>
        复制
      </Button>
      <Button variant="soft" tone="neutral" icon={<Scissors />}>
        剪切
      </Button>
      <Button variant="soft" tone="neutral" icon={<Trash2 />}>
        删除
      </Button>
    </ButtonGroup>
  )
}
