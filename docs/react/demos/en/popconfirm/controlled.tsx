'use client'

import { useState } from 'react'
import { Button, Inline, Popconfirm } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  return (
    <Inline gap="sm">
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        Open from outside
      </Button>
      <Popconfirm
        open={open}
        onOpenChange={setOpen}
        title="Discard the draft?"
        description="Everything in the draft is thrown away."
      >
        <Button variant="outline" tone="neutral">
          Discard draft
        </Button>
      </Popconfirm>
    </Inline>
  )
}
