'use client'

import { useState } from 'react'
import { Button, Inline, Menubar, MenubarItem, MenubarMenu, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState('')

  return (
    <Stack gap="md" align="start">
      <Inline gap="sm">
        <Button variant="outline" tone="neutral" onClick={() => setOpen('file')}>
          Open "File"
        </Button>
        <Button variant="outline" tone="neutral" onClick={() => setOpen('help')}>
          Open "Help"
        </Button>
      </Inline>
      <Menubar value={open} onValueChange={setOpen} label="Controlled menu">
        <MenubarMenu label="File" value="file">
          <MenubarItem>New</MenubarItem>
          <MenubarItem>Open</MenubarItem>
        </MenubarMenu>
        <MenubarMenu label="Help" value="help">
          <MenubarItem>Documentation</MenubarItem>
          <MenubarItem>About</MenubarItem>
        </MenubarMenu>
      </Menubar>
      <Text tone="muted" size="sm">
        Open now: {open || 'none'}
      </Text>
    </Stack>
  )
}
