'use client'

import { useState } from 'react'
import { Button, DropdownMenu, DropdownMenuItem, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <Inline align="center">
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
        label="受控菜单"
        content={
          <>
            <DropdownMenuItem>第一项</DropdownMenuItem>
            <DropdownMenuItem>第二项</DropdownMenuItem>
          </>
        }
      >
        <Button variant="outline" tone="neutral">
          菜单
        </Button>
      </DropdownMenu>
      <Button size="sm" variant="soft" tone="neutral" onClick={() => setOpen(!open)}>
        从外部{open ? '收起' : '展开'}
      </Button>
      <Text tone="muted" size="sm">
        当前：{open ? '展开' : '收起'}
      </Text>
    </Inline>
  )
}
