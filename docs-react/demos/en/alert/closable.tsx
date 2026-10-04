'use client'

import { useState } from 'react'
import { Alert, Button, Stack } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(true)

  return (
    <Stack className="min-h-28 w-full max-w-xl">
      <Alert open={open} onOpenChange={setOpen} tone="success" closable>
        The article has been published.
      </Alert>
      <Button
        variant="soft"
        tone="neutral"
        disabled={open}
        className="self-start"
        onClick={() => setOpen(true)}
      >
        Show again
      </Button>
    </Stack>
  )
}
