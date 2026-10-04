'use client'

import { useMemo, useRef, useState, type MouseEvent } from 'react'
import { Button, Lightbox, type LightboxItem } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const target = useRef<HTMLElement | null>(null)
  const items = useMemo<LightboxItem[]>(
    () => [
      {
        id: 'image-1',
        src: '/sample.webp',
        alt: 'A hillside on a summer afternoon',
        source: () =>
          target.current?.isConnected ? target.current.getBoundingClientRect() : undefined,
      },
    ],
    [],
  )

  function show(event: MouseEvent<HTMLElement>) {
    target.current = event.currentTarget
    setOpen(true)
  }

  return (
    <>
      <Button
        variant="ghost"
        tone="neutral"
        ripple={false}
        aria-label="Preview background image"
        className="h-36 w-64 cursor-zoom-in rounded-none border-0 bg-cover bg-center bg-no-repeat p-0"
        style={{ backgroundImage: 'url(/sample.webp)' }}
        onClick={show}
      />
      <Lightbox open={open} onOpenChange={setOpen} items={items} />
    </>
  )
}
