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
          锚点 {index}
        </Button>
      ))}
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchor={anchor}
        modal={false}
        aria-label="外部锚点"
        content={
          <Stack gap="sm" className="w-56">
            <Text size="sm">默认插槽为空，位置由 anchor 决定。</Text>
            <Button size="sm" variant="soft" tone="neutral" onClick={() => setOpen(false)}>
              关闭
            </Button>
          </Stack>
        }
      />
    </Inline>
  )
}
