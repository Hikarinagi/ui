import { HoverCard, Inline, Link, Text } from '@hina-ui/react'

const sides = ['top', 'right', 'bottom', 'left'] as const
const names = { top: '上方', right: '右侧', bottom: '下方', left: '左侧' }

export default function Demo() {
  return (
    <Inline gap="lg">
      {sides.map(side => (
        <HoverCard
          key={side}
          side={side}
          content={<Text size="sm">从{names[side]}浮出的卡片。</Text>}
        >
          <Link href="#">{names[side]}</Link>
        </HoverCard>
      ))}
    </Inline>
  )
}
