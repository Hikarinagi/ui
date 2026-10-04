import { Bold, Italic, Link2, Strikethrough } from 'lucide-react'
import { ButtonGroup, IconButton } from '@hina-ui/react'

export default function Demo() {
  return (
    <ButtonGroup label="文字格式">
      <IconButton label="加粗" variant="outline">
        <Bold />
      </IconButton>
      <IconButton label="斜体" variant="outline">
        <Italic />
      </IconButton>
      <IconButton label="删除线" variant="outline">
        <Strikethrough />
      </IconButton>
      <IconButton label="插入链接" variant="outline">
        <Link2 />
      </IconButton>
    </ButtonGroup>
  )
}
