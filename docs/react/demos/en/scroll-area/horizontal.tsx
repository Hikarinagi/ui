import { Card, Inline, ScrollArea } from '@hina-ui/react'

const cards = Array.from({ length: 12 }, (_, i) => i + 1)

export default function Demo() {
  return (
    <ScrollArea direction="horizontal" className="bg-inset w-full max-w-md rounded-md">
      <Inline gap="sm" wrap={false} className="p-4">
        {cards.map(i => (
          <Card
            key={i}
            className="bg-surface grid size-20 shrink-0 place-items-center"
            padded={false}
          >
            {i}
          </Card>
        ))}
      </Inline>
    </ScrollArea>
  )
}
