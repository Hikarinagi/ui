'use client'

import { useState } from 'react'
import { Button, Inline, Menubar, MenubarItem, MenubarMenu, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState('')

  return (
    <Stack gap="md" align="start">
      <Inline gap="sm">
        <Button variant="outline" tone="neutral" onClick={() => setOpen('file')}>
          展开「文件」
        </Button>
        <Button variant="outline" tone="neutral" onClick={() => setOpen('help')}>
          展开「帮助」
        </Button>
      </Inline>
      <Menubar value={open} onValueChange={setOpen} label="受控菜单">
        <MenubarMenu label="文件" value="file">
          <MenubarItem>新建</MenubarItem>
          <MenubarItem>打开</MenubarItem>
        </MenubarMenu>
        <MenubarMenu label="帮助" value="help">
          <MenubarItem>文档</MenubarItem>
          <MenubarItem>关于</MenubarItem>
        </MenubarMenu>
      </Menubar>
      <Text tone="muted" size="sm">
        当前展开：{open || '无'}
      </Text>
    </Stack>
  )
}
