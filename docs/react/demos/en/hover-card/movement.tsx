'use client'

import { useState, type FocusEvent, type PointerEvent } from 'react'
import { Button, HoverCard, Inline, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [current, setCurrent] = useState(1)
  const [moving, setMoving] = useState(false)

  function show(event: PointerEvent<HTMLElement> | FocusEvent<HTMLElement>, index: number) {
    const target = event.currentTarget
    if ('pointerType' in event ? event.pointerType === 'touch' : !target.matches(':focus-visible'))
      return
    if (!open) setMoving(false)
    else if (anchor !== target) setMoving(true)
    setAnchor(target)
    setCurrent(index)
    setOpen(true)
  }

  return (
    <Inline>
      {[1, 2, 3].map(index => (
        <Button
          key={index}
          variant="outline"
          tone="neutral"
          onPointerEnter={event => show(event, index)}
          onFocus={event => show(event, index)}
        >
          Anchor {index}
        </Button>
      ))}
      <HoverCard
        open={open}
        onOpenChange={setOpen}
        anchor={anchor}
        positionerClass={
          open && moving ? 'hn-transition-base motion-reduce:transition-none' : undefined
        }
        content={
          <Stack gap="xs" className="w-56">
            <Text weight="medium">Anchor {current}</Text>
            <Text tone="muted" size="sm">
              One card moves smoothly to the active anchor.
            </Text>
          </Stack>
        }
      />
    </Inline>
  )
}
