'use client'

import { useState } from 'react'
import { Button, HoverCard, Inline, Link, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <Inline gap="lg" align="center">
      <Button variant="outline" tone="neutral" disabled={open} onClick={() => setOpen(true)}>
        打开卡片
      </Button>
      <HoverCard
        open={open}
        onOpenChange={setOpen}
        content={<Text size="sm">卡片由外部打开；指针移开、点击外部或者按 Esc 都会收回。</Text>}
      >
        <Link href="#">查看预览</Link>
      </HoverCard>
      <Text tone="muted" size="sm">
        {open ? '已打开' : '已收回'}
      </Text>
    </Inline>
  )
}
