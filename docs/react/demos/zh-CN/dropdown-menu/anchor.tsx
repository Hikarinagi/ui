'use client'

import { useState, type KeyboardEvent, type MouseEvent } from 'react'
import { Button, DropdownMenu, DropdownMenuItem, Inline } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(0)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  function toggle(event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>, index: number) {
    const target = event.currentTarget
    setOpen(event.type === 'keydown' || anchor !== target || !open)
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
          aria-haspopup="menu"
          aria-expanded={open && current === index}
          onClick={event => toggle(event, index)}
          onKeyDown={event => {
            if (event.key !== 'ArrowDown') return
            event.preventDefault()
            toggle(event, index)
          }}
        >
          锚点 {index}
        </Button>
      ))}
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
        anchor={anchor}
        modal={false}
        label="外部菜单"
        content={
          <>
            <DropdownMenuItem>复制</DropdownMenuItem>
            <DropdownMenuItem>重命名</DropdownMenuItem>
            <DropdownMenuItem disabled>不可用</DropdownMenuItem>
          </>
        }
      />
    </Inline>
  )
}
