import { Card, PageBody, Section, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full">
      <PageBody>
        <Section title="作品简介">
          <Text size="sm" tone="muted">
            故事发生在一座临海的小镇。
          </Text>
        </Section>
        <Section title="登场角色">
          <Text size="sm" tone="muted">
            三位主要角色与若干配角。
          </Text>
        </Section>
        <Section title="制作人员">
          <Text size="sm" tone="muted">
            剧本、原画与音乐。
          </Text>
        </Section>
      </PageBody>
    </Card>
  )
}
