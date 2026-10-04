'use client'

import { useState } from 'react'
import { Button, Inline, Popconfirm } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  return (
    <Inline gap="sm">
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        从外部打开
      </Button>
      <Popconfirm
        open={open}
        onOpenChange={setOpen}
        title="清空草稿？"
        description="草稿里的内容会被丢弃。"
      >
        <Button variant="outline" tone="neutral">
          清空草稿
        </Button>
      </Popconfirm>
    </Inline>
  )
}
