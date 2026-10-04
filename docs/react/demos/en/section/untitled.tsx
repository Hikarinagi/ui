import { Card, Section, Tag, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full">
      <Section>
        <Inline gap="xs">
          <Tag>Fantasy</Tag>
          <Tag>School</Tag>
        </Inline>
        <Text size="sm" tone="muted">
          Without a title, no heading is rendered — only the grouping and spacing remain.
        </Text>
      </Section>
    </Card>
  )
}
