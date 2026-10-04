'use client'

import { useState } from 'react'
import {
  Kbd,
  Menubar,
  MenubarCheckboxItem,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  Stack,
  Text,
} from '@hina-ui/react'

export default function Demo() {
  const [last, setLast] = useState('')
  const [wrap, setWrap] = useState(true)
  const [numbers, setNumbers] = useState(false)
  const [theme, setTheme] = useState('system')

  return (
    <Stack gap="sm" align="start">
      <Menubar label="Editor menu">
        <MenubarMenu label="File">
          <MenubarItem trailing={<Kbd>Ctrl N</Kbd>} onSelect={() => setLast('New')}>
            New
          </MenubarItem>
          <MenubarItem trailing={<Kbd>Ctrl O</Kbd>} onSelect={() => setLast('Open')}>
            Open
          </MenubarItem>
          <MenubarSub label="Open recent">
            <MenubarItem onSelect={() => setLast('chapter-1.md')}>chapter-1.md</MenubarItem>
            <MenubarItem onSelect={() => setLast('outline.md')}>outline.md</MenubarItem>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem trailing={<Kbd>Ctrl S</Kbd>} onSelect={() => setLast('Save')}>
            Save
          </MenubarItem>
        </MenubarMenu>
        <MenubarMenu label="Edit">
          <MenubarItem trailing={<Kbd>Ctrl Z</Kbd>} onSelect={() => setLast('Undo')}>
            Undo
          </MenubarItem>
          <MenubarItem trailing={<Kbd>Ctrl Y</Kbd>} onSelect={() => setLast('Redo')}>
            Redo
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem trailing={<Kbd>Ctrl F</Kbd>} onSelect={() => setLast('Find')}>
            Find
          </MenubarItem>
        </MenubarMenu>
        <MenubarMenu label="View">
          <MenubarCheckboxItem checked={wrap} onCheckedChange={setWrap}>
            Word wrap
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={numbers} onCheckedChange={setNumbers}>
            Line numbers
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarRadioGroup value={theme} onValueChange={setTheme}>
            <MenubarRadioItem value="light">Light</MenubarRadioItem>
            <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
            <MenubarRadioItem value="system">System</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarMenu>
      </Menubar>
      {last && (
        <Text tone="muted" size="sm">
          Picked: {last}
        </Text>
      )}
    </Stack>
  )
}
