'use client'

import { useState } from 'react'
import { Button, Dialog, Stack, Text, type DialogHandle } from '@hina-ui/react'

export default function Demo() {
  const [modal, setModal] = useState<DialogHandle | null>(null)

  function scrollTo(position: 'start' | 'end') {
    const viewport = modal?.viewport
    if (!viewport) return
    viewport.scrollTo({ top: position === 'start' ? 0 : viewport.scrollHeight })
  }

  return (
    <Dialog
      ref={setModal}
      title="Scroll viewport"
      description="The title and footer stay fixed while the body scrolls."
      renderContent={() => (
        <Stack gap="sm">
          {Array.from({ length: 30 }, (_, i) => i + 1).map(index => (
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
            disabled={!modal?.viewport}
            onClick={() => scrollTo('start')}
          >
            Top
          </Button>
          <Button
            variant="soft"
            tone="neutral"
            disabled={!modal?.viewport}
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
    </Dialog>
  )
}
