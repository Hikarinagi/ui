import { Card, Section, Tag, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full">
      <Section>
        <Inline gap="xs">
          <Tag>奇幻</Tag>
          <Tag>校园</Tag>
        </Inline>
        <Text size="sm" tone="muted">
          不写 title 时不渲染标题，只保留分组与间距。
        </Text>
      </Section>
    </Card>
  )
}
