import { HoverCard, Inline, Link, Text } from '@hina-ui/react'

const sides = ['top', 'right', 'bottom', 'left'] as const
const names = { top: 'Top', right: 'Right', bottom: 'Bottom', left: 'Left' }

export default function Demo() {
  return (
    <Inline gap="lg">
      {sides.map(side => (
        <HoverCard
          key={side}
          side={side}
          content={<Text size="sm">A card floating out on the {names[side].toLowerCase()}.</Text>}
        >
          <Link href="#">{names[side]}</Link>
        </HoverCard>
      ))}
    </Inline>
  )
}
