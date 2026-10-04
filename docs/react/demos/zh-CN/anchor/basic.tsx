import { Anchor, Heading, Inline, ScrollArea, Section, Text } from '@hina-ui/react'

const items = [
  { id: 'basic-a', label: '作品简介' },
  { id: 'basic-b', label: '登场角色' },
  { id: 'basic-c', label: '制作人员' },
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
              这一节的正文。
            </Text>
          </Section>
        ))}
      </ScrollArea>
      <Anchor items={items} className="w-28 shrink-0" />
    </Inline>
  )
}
