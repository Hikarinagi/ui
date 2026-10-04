'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Button,
  ScrollArea,
  Inline,
  Stack,
  Text,
  Popover,
  type OverlayAnchor,
} from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const surface = useRef<HTMLElement>(null)
  const [anchor, setAnchor] = useState<OverlayAnchor | null>(null)
  const x = useRef(80)
  const [left, setLeft] = useState(80)

  useEffect(() => {
    if (!open) return
    let frame = 0
    let previous = 0
    const loop = (timestamp: number) => {
      if (!previous) previous = timestamp
      const delta = timestamp - previous
      previous = timestamp
      x.current = 80 + ((x.current - 80 + delta / 35) % 120)
      setLeft(x.current)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [open])

  function show() {
    const element = surface.current
    if (!element) return
    setAnchor({
      contextElement: element,
      getBoundingClientRect: () => {
        const rect = element.getBoundingClientRect()
        return new DOMRect(rect.left + x.current, rect.top + 100, 2, 20)
      },
    })
    setOpen(true)
  }

  return (
    <Stack className="w-full">
      <Inline>
        <Button variant="outline" tone="neutral" onClick={show}>
          打开
        </Button>
        <Text size="sm" tone="muted">
          向下滚动可观察定位变化。
        </Text>
      </Inline>
      <ScrollArea className="h-64 rounded-lg border border-line bg-inset">
        <Stack ref={surface} className="relative h-128 shrink-0">
          <Text
            as="span"
            aria-hidden="true"
            className="absolute top-25 h-5 w-0.5 bg-accent"
            style={{ left: `${left}px` }}
          />
        </Stack>
      </ScrollArea>
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchor={anchor}
        updatePositionStrategy="always"
        align="start"
        modal={false}
        onOpenAutoFocus={event => event.preventDefault()}
        content={<Text size="sm">移动坐标</Text>}
      />
    </Stack>
  )
}
