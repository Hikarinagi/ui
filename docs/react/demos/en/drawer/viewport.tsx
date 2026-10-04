'use client'

import { useCallback, useState } from 'react'
import { Button, Drawer, Stack, Text, type DrawerHandle } from '@hina-ui/react'

export default function Demo() {
  const [viewport, setViewport] = useState<HTMLElement>()
  const modal = useCallback((handle: DrawerHandle | null) => setViewport(handle?.viewport), [])

  function scrollTo(position: 'start' | 'end') {
    if (!viewport) return
    viewport.scrollTo({ top: position === 'start' ? 0 : viewport.scrollHeight })
  }

  return (
    <Drawer
      ref={modal}
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
            disabled={!viewport}
            onClick={() => scrollTo('start')}
          >
            Top
          </Button>
          <Button
            variant="soft"
            tone="neutral"
            disabled={!viewport}
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
    </Drawer>
  )
}
