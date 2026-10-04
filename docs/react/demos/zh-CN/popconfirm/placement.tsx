import { Button, Inline, Popconfirm } from '@hina-ui/react'

const sides = ['top', 'right', 'bottom', 'left'] as const
const names = { top: '上方', right: '右侧', bottom: '下方', left: '左侧' }

export default function Demo() {
  return (
    <Inline gap="sm">
      {sides.map(side => (
        <Popconfirm key={side} title="确认这个位置？" side={side}>
          <Button variant="outline" tone="neutral">
            {names[side]}
          </Button>
        </Popconfirm>
      ))}
    </Inline>
  )
}
