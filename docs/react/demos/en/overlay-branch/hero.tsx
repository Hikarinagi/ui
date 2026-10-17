'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Button, Card, Drawer, OverlayBranch, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(0)

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Reading settings"
        renderContent={() => (
          <Text tone="muted">
            The card in the bottom corner is outside the drawer. Pressing its button leaves the
            drawer open.
          </Text>
        )}
      >
        <Button variant="outline" tone="neutral">
          Open drawer
        </Button>
      </Drawer>
      {open &&
        createPortal(
          <OverlayBranch className="fixed start-4 bottom-4 z-[calc(var(--hn-z-overlay)+1)] w-56">
            <Card className="flex flex-col gap-2 p-3 shadow-lg">
              <Text size="sm" tone="muted">
                Outside layer
              </Text>
              <Button size="sm" onClick={() => setCount(value => value + 1)}>
                Clicked {count} times
              </Button>
            </Card>
          </OverlayBranch>,
          document.body,
        )}
    </>
  )
}
