import { Card, Section, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full">
      <Section title="发售信息">
        <Text size="sm" tone="muted">
          2015-10-23 由枕发行，支持 Windows。
        </Text>
        <Text size="sm" tone="muted">
          标题渲染为二级标题，与正文之间由组件统一间距。
        </Text>
      </Section>
    </Card>
  )
}
