import { Anchor, Heading, Inline, ScrollArea, Section, Text } from '@hina-ui/react'

const sections = [
  { id: 'hero-intro', label: 'Overview' },
  { id: 'hero-install', label: 'Installation' },
  { id: 'hero-usage', label: 'Usage' },
]

export default function Demo() {
  return (
    <Inline gap="lg" align="start" className="w-full max-w-2xl">
      <ScrollArea className="border-line h-56 flex-1 rounded-lg border">
        {sections.map(s => (
          <Section id={s.id} key={s.id} className="min-h-40 p-4">
            <Heading level={3} size="sm">
              {s.label}
            </Heading>
            <Text size="sm" tone="muted">
              Scroll this area and the entries on the right follow along.
            </Text>
          </Section>
        ))}
      </ScrollArea>
      <Anchor items={sections} className="w-28 shrink-0" />
    </Inline>
  )
}
