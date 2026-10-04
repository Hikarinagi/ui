'use client'

import NextLink from 'next/link'
import { BookOpen, ArrowUpRight, Palette } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  Stack,
  Text,
  Tag,
  Divider,
} from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="min-h-72 w-full" align="start">
      <NavigationMenu label="自定义导航">
        <NavigationMenuItem value="resources">
          <NavigationMenuTrigger icon={<BookOpen />}>资源</NavigationMenuTrigger>
          <NavigationMenuContent padded={false} className="w-96">
            <Stack gap="xs" className="p-4">
              <Text weight="medium">设计与组件</Text>
              <Text size="sm" tone="muted">
                内容区域由插槽自由组合。
              </Text>
            </Stack>
            <Divider />
            <Stack gap="xs" className="p-2">
              <NavigationMenuLink
                as={NextLink}
                href="/design/colors"
                description="语义色、表现色与主题切换"
                icon={<Palette />}
                trailing={<Tag size="sm">更新</Tag>}
              >
                颜色规范
              </NavigationMenuLink>
              <NavigationMenuLink
                href="https://github.com/Hikarinagi/ui"
                target="_blank"
                rel="noopener noreferrer"
                trailing={<ArrowUpRight />}
              >
                GitHub
              </NavigationMenuLink>
            </Stack>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenu>
    </Stack>
  )
}
