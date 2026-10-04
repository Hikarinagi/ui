import { Card, PageBody, Section, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full">
      <PageBody>
        <Section title="Synopsis">
          <Text size="sm" tone="muted">
            The story is set in a small seaside town.
          </Text>
        </Section>
        <Section title="Characters">
          <Text size="sm" tone="muted">
            Three leads and a handful of supporting characters.
          </Text>
        </Section>
        <Section title="Staff">
          <Text size="sm" tone="muted">
            Writing, art and music.
          </Text>
        </Section>
      </PageBody>
    </Card>
  )
}
