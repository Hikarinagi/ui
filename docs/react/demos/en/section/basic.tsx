import { Card, Section, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full">
      <Section title="Release">
        <Text size="sm" tone="muted">
          Released by Makura on 2015-10-23 for Windows.
        </Text>
        <Text size="sm" tone="muted">
          The title renders as a second-level heading, spaced from the body by the component.
        </Text>
      </Section>
    </Card>
  )
}
