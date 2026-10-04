import { Anchor, Card, Inline, ScrollArea, Section, Text } from '@hina-ui/react'

const items = [
  { id: 'sec-intro', label: '简介' },
  { id: 'sec-cast', label: '角色' },
  { id: 'sec-staff', label: '制作人员' },
]

export default function Demo() {
  return (
    <Inline gap="lg" align="start" className="w-full">
      <Card padded={false} className="min-w-0 flex-1 overflow-hidden">
        <ScrollArea className="h-56">
          {items.map(item => (
            <Section key={item.id} id={item.id} title={item.label} className="p-4">
              <Text size="sm" tone="muted">
                这一节的正文。
              </Text>
              <Text size="sm" tone="muted">
                滚动或点击右侧条目都会更新当前位置。
              </Text>
            </Section>
          ))}
        </ScrollArea>
      </Card>
      <Anchor items={items} className="w-28 shrink-0" />
    </Inline>
  )
}
