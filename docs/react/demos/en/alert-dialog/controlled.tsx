'use client'

import { useState } from 'react'
import { AlertDialog, Button, Inline } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  return (
    <Inline gap="sm">
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        Open from outside
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Leave this page?"
        description="Unsaved changes will be lost."
      />
    </Inline>
  )
}
