'use client'

import { useState } from 'react'
import {
  Anchor,
  Button,
  Heading,
  Inline,
  ScrollArea,
  Section,
  Stack,
  Tag,
  Text,
} from '@hina-ui/react'

export default function Demo() {
  const [modified, setModified] = useState(true)
  const items = [
    { id: 'trailing-a', label: '条目 A', modified },
    {
      id: 'trailing-b',
      label: '条目 B',
      modified: false,
      children: [{ id: 'trailing-c', label: '子条目', modified: true }],
    },
  ]
  const sections = items.flatMap(item => [item, ...(item.children ?? [])])

  return (
    <Stack gap="md" className="w-full max-w-2xl">
      <Inline>
        <Button
          variant="soft"
          tone="neutral"
          aria-pressed={modified}
          onClick={() => setModified(!modified)}
        >
          切换条目 A 的标记
        </Button>
      </Inline>
      <Inline gap="lg" align="start" wrap={false}>
        <ScrollArea className="border-line h-56 min-w-0 flex-1 rounded-lg border">
          {sections.map(item => (
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
        <Anchor
          items={items}
          label="带尾部标记的目录"
          className="w-44 shrink-0"
          renderTrailing={({ item, active }) =>
            item.modified ? <Tag tone={active ? 'accent' : 'neutral'}>已修改</Tag> : null
          }
        />
      </Inline>
    </Stack>
  )
}
