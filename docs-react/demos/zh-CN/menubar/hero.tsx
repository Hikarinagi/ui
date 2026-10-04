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
      <Menubar label="编辑器菜单">
        <MenubarMenu label="文件">
          <MenubarItem trailing={<Kbd>Ctrl N</Kbd>} onSelect={() => setLast('新建')}>
            新建
          </MenubarItem>
          <MenubarItem trailing={<Kbd>Ctrl O</Kbd>} onSelect={() => setLast('打开')}>
            打开
          </MenubarItem>
          <MenubarSub label="最近打开">
            <MenubarItem onSelect={() => setLast('第一章.md')}>第一章.md</MenubarItem>
            <MenubarItem onSelect={() => setLast('大纲.md')}>大纲.md</MenubarItem>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem trailing={<Kbd>Ctrl S</Kbd>} onSelect={() => setLast('保存')}>
            保存
          </MenubarItem>
        </MenubarMenu>
        <MenubarMenu label="编辑">
          <MenubarItem trailing={<Kbd>Ctrl Z</Kbd>} onSelect={() => setLast('撤销')}>
            撤销
          </MenubarItem>
          <MenubarItem trailing={<Kbd>Ctrl Y</Kbd>} onSelect={() => setLast('重做')}>
            重做
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem trailing={<Kbd>Ctrl F</Kbd>} onSelect={() => setLast('查找')}>
            查找
          </MenubarItem>
        </MenubarMenu>
        <MenubarMenu label="视图">
          <MenubarCheckboxItem checked={wrap} onCheckedChange={setWrap}>
            自动换行
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={numbers} onCheckedChange={setNumbers}>
            显示行号
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarRadioGroup value={theme} onValueChange={setTheme}>
            <MenubarRadioItem value="light">浅色</MenubarRadioItem>
            <MenubarRadioItem value="dark">深色</MenubarRadioItem>
            <MenubarRadioItem value="system">跟随系统</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarMenu>
      </Menubar>
      {last && (
        <Text tone="muted" size="sm">
          选择了：{last}
        </Text>
      )}
    </Stack>
  )
}
