'use client'

import { useRef } from 'react'
import { Button, Sheet, Stack, Text, type SheetHandle } from '@hina-ui/react'

const lines = Array.from({ length: 30 }, (_, i) => i + 1)

export default function Demo() {
  const modal = useRef<SheetHandle>(null)

  function scrollTo(position: 'start' | 'end') {
    const viewport = modal.current?.viewport
    if (!viewport) return
    viewport.scrollTo({ top: position === 'start' ? 0 : viewport.scrollHeight })
  }

  return (
    <Sheet
      ref={modal}
      title="Scroll viewport"
      description="The title and footer stay fixed while the body scrolls."
      renderContent={() => (
        <Stack gap="sm">
          {lines.map(index => (
            <Text key={index}>
              Line {index} The title and footer stay fixed while this content scrolls.
            </Text>
          ))}
        </Stack>
      )}
      renderFooter={({ close }) => (
        <>
          <Button
            variant="soft"
            tone="neutral"
            disabled={!modal.current?.viewport}
            onClick={() => scrollTo('start')}
          >
            Top
          </Button>
          <Button
            variant="soft"
            tone="neutral"
            disabled={!modal.current?.viewport}
            onClick={() => scrollTo('end')}
          >
            Bottom
          </Button>
          <Button onClick={close}>Close</Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral">
        Open
      </Button>
    </Sheet>
  )
}
