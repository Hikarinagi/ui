'use client'

import { useState, type FocusEvent, type PointerEvent } from 'react'
import { Button, HoverCard, Inline, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [current, setCurrent] = useState(1)

  function show(event: PointerEvent<HTMLElement> | FocusEvent<HTMLElement>, index: number) {
    const target = event.currentTarget
    if ('pointerType' in event ? event.pointerType === 'touch' : !target.matches(':focus-visible'))
      return
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
          锚点 {index}
        </Button>
      ))}
      <HoverCard
        open={open}
        onOpenChange={setOpen}
        anchor={anchor}
        content={
          <Stack gap="xs" className="w-56">
            <Text weight="medium">锚点 {current}</Text>
            <Text tone="muted" size="sm">
              同一个卡片随当前锚点切换位置与内容。
            </Text>
          </Stack>
        }
      />
    </Inline>
  )
}
