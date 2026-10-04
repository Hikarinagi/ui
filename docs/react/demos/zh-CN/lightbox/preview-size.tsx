'use client'

import { useMemo, useRef, useState, type MouseEvent } from 'react'
import { Button, Image, Lightbox, type LightboxItem } from '@hina-ui/react'

const image = {
  thumbnail: '/sample-thumbnail.webp',
  original: '/sample.webp',
  width: 1200,
  height: 675,
}

export default function Demo() {
  const [open, setOpen] = useState(false)
  const target = useRef<HTMLElement | null>(null)
  const items = useMemo<LightboxItem[]>(
    () => [
      {
        id: 'image-1',
        src: image.thumbnail,
        preview: image.original,
        previewSize: { width: image.width, height: image.height },
        alt: '夏日午后的坡道',
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
        aria-label="打开图片预览"
        className="h-auto w-64 cursor-zoom-in rounded-none border-0 p-0"
        onClick={show}
      >
        <Image
          src={image.thumbnail}
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
