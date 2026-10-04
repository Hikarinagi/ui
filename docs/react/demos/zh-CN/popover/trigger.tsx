import { Info } from 'lucide-react'
import { IconButton, Inline, Link, Popover, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Popover content={<Text size="sm">触发器是一个图标按钮。</Text>}>
        <IconButton variant="ghost" tone="neutral" label="查看说明" tooltip={false}>
          <Info />
        </IconButton>
      </Popover>
      <Popover align="start" content={<Text size="sm">触发器是一段行内的链接文字。</Text>}>
        <Link href="#">星见书音</Link>
      </Popover>
    </Inline>
  )
}
