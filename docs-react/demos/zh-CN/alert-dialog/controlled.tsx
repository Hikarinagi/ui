'use client'

import { useState } from 'react'
import { AlertDialog, Button, Inline } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  return (
    <Inline gap="sm">
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        从外部打开
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="离开当前页面？"
        description="未保存的修改会丢失。"
      />
    </Inline>
  )
}
