'use client'

import { useState } from 'react'
import { Alert, Button, Stack } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(true)

  return (
    <Stack className="min-h-28 w-full max-w-xl">
      <Alert open={open} onOpenChange={setOpen} tone="success" closable>
        文章已发布。
      </Alert>
      <Button
        variant="soft"
        tone="neutral"
        disabled={open}
        className="self-start"
        onClick={() => setOpen(true)}
      >
        再次显示
      </Button>
    </Stack>
  )
}
