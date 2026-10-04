'use client'

import { useState } from 'react'
import { Button, Lightbox, type LightboxItem } from '@hina-ui/react'

const items: LightboxItem[] = [
  { id: 'image-1', src: '/sample.webp', alt: 'A hillside on a summer afternoon' },
]

export default function Demo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        Open preview
      </Button>
      <Lightbox open={open} onOpenChange={setOpen} items={items} />
    </>
  )
}
