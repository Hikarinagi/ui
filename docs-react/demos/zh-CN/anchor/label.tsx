import { Anchor, Heading, Inline, ScrollArea, Section, Text } from '@hina-ui/react'

const items = [
  { id: 'label-a', label: '版本 1.2' },
  { id: 'label-b', label: '版本 1.1' },
  { id: 'label-c', label: '版本 1.0' },
]

export default function Demo() {
  return (
    <Inline gap="lg" align="start" className="w-full max-w-2xl">
      <ScrollArea className="border-line h-56 flex-1 rounded-lg border">
        {items.map(item => (
          <Section id={item.id} key={item.id} className="min-h-40 p-4">
            <Heading level={3} size="sm">
              {item.label}
            </Heading>
            <Text size="sm" tone="muted">
              这一版的更新内容。
            </Text>
          </Section>
        ))}
      </ScrollArea>
      <Anchor items={items} label="版本目录" className="w-28 shrink-0" />
    </Inline>
  )
}
