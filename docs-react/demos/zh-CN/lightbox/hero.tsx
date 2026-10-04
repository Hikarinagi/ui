'use client'

import { useState } from 'react'
import { Button, Lightbox, type LightboxItem } from '@hina-ui/react'

const items: LightboxItem[] = [{ id: 'image-1', src: '/sample.webp', alt: '夏日午后的坡道' }]

export default function Demo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        打开预览
      </Button>
      <Lightbox open={open} onOpenChange={setOpen} items={items} />
    </>
  )
}
