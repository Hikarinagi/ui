import { Button, Inline, Popconfirm } from '@hina-ui/react'

const sides = ['top', 'right', 'bottom', 'left'] as const
const names = { top: 'Top', right: 'Right', bottom: 'Bottom', left: 'Left' }

export default function Demo() {
  return (
    <Inline gap="sm">
      {sides.map(side => (
        <Popconfirm key={side} title="Confirm this placement?" side={side}>
          <Button variant="outline" tone="neutral">
            {names[side]}
          </Button>
        </Popconfirm>
      ))}
    </Inline>
  )
}
