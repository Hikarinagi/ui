'use client'

import NextLink from 'next/link'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  Stack,
} from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="min-h-56 w-full" align="start">
      <NavigationMenu label="纵向导航" orientation="vertical" align="start" size="sm">
        <NavigationMenuItem value="design">
          <NavigationMenuTrigger>设计规范</NavigationMenuTrigger>
          <NavigationMenuContent className="w-64">
            <NavigationMenuLink as={NextLink} href="/design/colors">
              颜色
            </NavigationMenuLink>
            <NavigationMenuLink as={NextLink} href="/design/typography">
              排版
            </NavigationMenuLink>
            <NavigationMenuLink as={NextLink} href="/design/layout">
              布局
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink as={NextLink} href="/components">
            组件
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink as={NextLink} href="/changelog">
            变更记录
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>
    </Stack>
  )
}
