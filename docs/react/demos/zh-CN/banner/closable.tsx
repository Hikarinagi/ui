'use client'

import { useState } from 'react'
import { Banner, Button, Stack } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(true)

  return (
    <Stack className="min-h-24 w-full">
      <Banner open={open} onOpenChange={setOpen} tone="success" closable>
        你的邮箱已完成验证。
      </Banner>
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
