'use client'

import { useState } from 'react'
import { Anchor, Heading, Inline, ScrollArea, Section, Stack, Switch, Text } from '@hina-ui/react'

const topics = ['Background', 'Design process', 'Implementation', 'User experience', 'Conclusions']
const items = Array.from({ length: 51 }, (_, index) => ({
  id: `long-toc-${index + 1}`,
  label: `${index + 1}. ${topics[index % topics.length]}`,
}))

export default function Demo() {
  const [autoScroll, setAutoScroll] = useState(true)
  const [current, setCurrent] = useState<string>()
  const currentLabel = items.find(item => item.id === current)?.label

  return (
    <Stack className="w-full max-w-2xl">
      <Inline justify="between">
        <Switch checked={autoScroll} onCheckedChange={setAutoScroll}>
          Follow current entry
        </Switch>
        <Text size="sm" tone="muted">
          51 sections
        </Text>
      </Inline>
      <Inline align="start" gap="md" wrap={false}>
        <ScrollArea
          className="border-line h-80 min-w-0 flex-1 rounded-lg border"
          focusable
          label="Article content"
        >
          {items.map(item => (
            <Section id={item.id} key={item.id} className="min-h-56 p-4">
              <Heading level={3} size="sm">
                {item.label}
              </Heading>
              <Text size="sm" tone="muted">
                Scroll through the article to keep its current entry visible in the contents. You
                can also browse the contents independently to find another section.
              </Text>
            </Section>
          ))}
        </ScrollArea>
        <ScrollArea
          className="h-80 w-2/5 max-w-48 shrink-0"
          shadow={false}
          focusable
          label="Scrollable article contents"
        >
          <Anchor
            items={items}
            autoScroll={autoScroll}
            label="Long article contents"
            onChange={setCurrent}
          />
        </ScrollArea>
      </Inline>
      <Text size="sm" tone="muted">
        Current: {currentLabel ?? 'Article is outside the reading area'}
      </Text>
    </Stack>
  )
}
