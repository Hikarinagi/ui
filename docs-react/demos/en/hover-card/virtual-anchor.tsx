'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Button,
  ScrollArea,
  Inline,
  Stack,
  Text,
  HoverCard,
  type OverlayAnchor,
} from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const surface = useRef<HTMLElement>(null)
  const [anchor, setAnchor] = useState<OverlayAnchor | null>(null)
  const [x, setX] = useState(80)
  const position = useRef(80)

  useEffect(() => {
    if (!open) return
    let frame = 0
    let previous = 0
    function tick(now: number) {
      const delta = previous ? now - previous : 0
      previous = now
      position.current = 80 + ((position.current - 80 + delta / 35) % 120)
      setX(position.current)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [open])

  function show() {
    const element = surface.current
    if (!element) return
    setAnchor({
      contextElement: element,
      getBoundingClientRect: () => {
        const rect = element.getBoundingClientRect()
        return new DOMRect(rect.left + position.current, rect.top + 100, 2, 20)
      },
    })
    setOpen(true)
  }

  return (
    <Stack className="w-full">
      <Inline>
        <Button variant="outline" tone="neutral" onClick={show}>
          Open
        </Button>
        <Text size="sm" tone="muted">
          Scroll down to observe the position update.
        </Text>
      </Inline>
      <ScrollArea className="h-64 rounded-lg border border-line bg-inset">
        <Stack ref={surface} className="relative h-128 shrink-0">
          <Text
            as="span"
            aria-hidden="true"
            className="absolute top-25 h-5 w-0.5 bg-accent"
            style={{ left: `${x}px` }}
          />
        </Stack>
      </ScrollArea>
      <HoverCard
        open={open}
        onOpenChange={setOpen}
        anchor={anchor}
        updatePositionStrategy="always"
        align="start"
        content={<Text size="sm">Moving coordinates</Text>}
      />
    </Stack>
  )
}
