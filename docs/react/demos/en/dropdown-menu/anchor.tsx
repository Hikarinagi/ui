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
          Anchor {index}
        </Button>
      ))}
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
        anchor={anchor}
        modal={false}
        label="External menu"
        content={
          <>
            <DropdownMenuItem>Copy</DropdownMenuItem>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem disabled>Unavailable</DropdownMenuItem>
          </>
        }
      />
    </Inline>
  )
}
