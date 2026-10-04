import { Anchor, Card, Inline, ScrollArea, Section, Text } from '@hina-ui/react'

const items = [
  { id: 'sec-intro', label: 'Overview' },
  { id: 'sec-cast', label: 'Characters' },
  { id: 'sec-staff', label: 'Staff' },
]

export default function Demo() {
  return (
    <Inline gap="lg" align="start" className="w-full">
      <Card padded={false} className="min-w-0 flex-1 overflow-hidden">
        <ScrollArea className="h-56">
          {items.map(item => (
            <Section key={item.id} id={item.id} title={item.label} className="p-4">
              <Text size="sm" tone="muted">
                Body text for this section.
              </Text>
              <Text size="sm" tone="muted">
                Scrolling or clicking an entry on the right updates the current position.
              </Text>
            </Section>
          ))}
        </ScrollArea>
      </Card>
      <Anchor items={items} className="w-28 shrink-0" />
    </Inline>
  )
}
