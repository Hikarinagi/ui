'use client'

import { useMemo, useRef, useState, type MouseEvent } from 'react'
import { Button, Image, Lightbox, type LightboxItem } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const source = useRef<HTMLImageElement | null>(null)
  const items = useMemo<LightboxItem[]>(
    () => [
      {
        id: 'image-1',
        src: '/sample.webp',
        alt: '夏日午后的坡道',
        fit: 'cover',
        source: () => source.current,
      },
    ],
    [],
  )

  function show(event: MouseEvent<HTMLElement>) {
    source.current = event.currentTarget.querySelector('img')
    setOpen(true)
  }

  return (
    <>
      <Button
        variant="ghost"
        tone="neutral"
        ripple={false}
        aria-label="打开图片预览"
        className="h-auto w-64 cursor-zoom-in overflow-hidden rounded-xl border-0 p-0"
        onClick={show}
      >
        <Image
          src="/sample.webp"
          alt="夏日午后的坡道"
          ratio={16 / 9}
          lazy={false}
          className="w-64"
        />
      </Button>
      <Lightbox open={open} onOpenChange={setOpen} items={items} />
    </>
  )
}
