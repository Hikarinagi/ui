'use client'

import { useState, type MouseEvent } from 'react'
import { Button, Inline, Popover, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(0)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  function toggle(event: MouseEvent<HTMLElement>, index: number) {
    const target = event.currentTarget
    setOpen(anchor === target ? !open : true)
    setAnchor(target)
    setCurrent(index)
  }

  return (
    <Inline>
      {[1, 2].map(index => (
        <Button
          key={index}
          variant="outline"
          tone="neutral"
          aria-haspopup="dialog"
          aria-expanded={open && current === index}
          onClick={event => toggle(event, index)}
        >
          Anchor {index}
        </Button>
      ))}
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchor={anchor}
        modal={false}
        aria-label="External anchor"
        content={
          <Stack gap="sm" className="w-56">
            <Text size="sm">The default slot is empty. The anchor sets the position.</Text>
            <Button size="sm" variant="soft" tone="neutral" onClick={() => setOpen(false)}>
              Close
            </Button>
          </Stack>
        }
      />
    </Inline>
  )
}
