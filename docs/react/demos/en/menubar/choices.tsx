'use client'

import { useState } from 'react'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  Stack,
  Text,
} from '@hina-ui/react'

const names: Record<string, string> = { sm: 'small', md: 'medium', lg: 'large' }

export default function Demo() {
  const [wrap, setWrap] = useState(true)
  const [numbers, setNumbers] = useState(false)
  const [size, setSize] = useState('md')

  return (
    <Stack gap="sm" align="start">
      <Menubar label="View settings">
        <MenubarMenu label="View">
          <MenubarCheckboxItem checked={wrap} onCheckedChange={setWrap}>
            Word wrap
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={numbers} onCheckedChange={setNumbers}>
            Line numbers
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>Font size</MenubarLabel>
          <MenubarRadioGroup value={size} onValueChange={setSize}>
            <MenubarRadioItem value="sm">Small</MenubarRadioItem>
            <MenubarRadioItem value="md">Medium</MenubarRadioItem>
            <MenubarRadioItem value="lg">Large</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarMenu>
      </Menubar>
      <Text tone="muted" size="sm">
        {`Word wrap ${wrap ? 'on' : 'off'}, line numbers ${numbers ? 'on' : 'off'}, font size ${names[size]}`}
      </Text>
    </Stack>
  )
}
