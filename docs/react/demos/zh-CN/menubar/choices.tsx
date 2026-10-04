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

const names: Record<string, string> = { sm: '小', md: '中', lg: '大' }

export default function Demo() {
  const [wrap, setWrap] = useState(true)
  const [numbers, setNumbers] = useState(false)
  const [size, setSize] = useState('md')

  return (
    <Stack gap="sm" align="start">
      <Menubar label="视图设置">
        <MenubarMenu label="视图">
          <MenubarCheckboxItem checked={wrap} onCheckedChange={setWrap}>
            自动换行
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={numbers} onCheckedChange={setNumbers}>
            显示行号
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>字号</MenubarLabel>
          <MenubarRadioGroup value={size} onValueChange={setSize}>
            <MenubarRadioItem value="sm">小</MenubarRadioItem>
            <MenubarRadioItem value="md">中</MenubarRadioItem>
            <MenubarRadioItem value="lg">大</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarMenu>
      </Menubar>
      <Text tone="muted" size="sm">
        {`自动换行${wrap ? '开' : '关'}，行号${numbers ? '开' : '关'}，字号${names[size]}`}
      </Text>
    </Stack>
  )
}
