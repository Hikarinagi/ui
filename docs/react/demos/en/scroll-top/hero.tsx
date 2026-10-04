'use client'

import { useRef } from 'react'
import {
  Card,
  Heading,
  ScrollArea,
  ScrollTop,
  Stack,
  Text,
  type ScrollAreaHandle,
} from '@hina-ui/react'

const sections = [
  {
    title: 'Set a clear action hierarchy',
    body: 'A region usually needs one primary action. Keep secondary actions near their content and move less common actions into a menu, keeping the usual path clear.',
  },
  {
    title: 'Provide visible feedback',
    body: 'Saving, uploading, and syncing all need feedback. Keep content visible while waiting and show the result when finished. Preserve input after a failure so users can retry.',
  },
  {
    title: 'Make long content easy to browse',
    body: 'Use headings for structure and spacing to separate paragraphs. Keep long lists at a stable scroll position and offer a way back to the beginning without forcing a scroll when content changes.',
  },
  {
    title: 'Support different input methods',
    body: 'Mouse, touch, and keyboard users should all be able to act. Keep focus visible, name icon buttons, and restore focus to a useful place when an overlay closes.',
  },
  {
    title: 'Reduce unnecessary motion',
    body: 'Motion explains changes in state and position. When reduced motion is enabled, keep the outcome while allowing users to skip scrolling and movement animations.',
  },
  {
    title: 'Check realistic scenarios',
    body: 'Try longer labels, narrow the window, use the keyboard, and check dark mode. A component is ready when these scenarios work as well as the basic example.',
  },
]

export default function Demo() {
  const area = useRef<ScrollAreaHandle>(null)

  return (
    <Stack className="w-full max-w-lg" gap="sm">
      <Text size="sm" tone="muted">
        Scroll inside the panel. The back-to-top button appears after 120px.
      </Text>
      <Card padded={false} className="relative overflow-hidden">
        <ScrollArea
          ref={area}
          className="h-72"
          shadow={false}
          focusable
          label="Interaction design notes"
        >
          <Stack gap="lg" className="p-5 pb-24">
            {sections.map(section => (
              <Stack key={section.title} gap="sm">
                <Heading level={3} size="base">
                  {section.title}
                </Heading>
                <Text size="sm" tone="muted">
                  {section.body}
                </Text>
              </Stack>
            ))}
          </Stack>
        </ScrollArea>
        <ScrollTop
          target={() => area.current?.viewport}
          threshold={120}
          position="absolute"
          offset={16}
        />
      </Card>
    </Stack>
  )
}
