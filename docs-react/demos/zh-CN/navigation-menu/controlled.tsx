'use client'

import { useState } from 'react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  Stack,
  Text,
} from '@hina-ui/react'

export default function Demo() {
  const [value, setValue] = useState('')
  return (
    <Stack className="min-h-56 w-full" align="start">
      <Text size="sm" tone="muted">
        展开项：{value || '无'}
      </Text>
      <NavigationMenu value={value} onValueChange={setValue} label="点击展开" trigger="click">
        <NavigationMenuItem value="links">
          <NavigationMenuTrigger>链接</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#controlled">选择后关闭</NavigationMenuLink>
            <NavigationMenuLink href="#controlled" onSelect={event => event.preventDefault()}>
              选择后保持打开
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenu>
    </Stack>
  )
}
