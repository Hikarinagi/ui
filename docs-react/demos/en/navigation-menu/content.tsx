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
      <NavigationMenu label="Custom navigation">
        <NavigationMenuItem value="resources">
          <NavigationMenuTrigger icon={<BookOpen />}>Resources</NavigationMenuTrigger>
          <NavigationMenuContent padded={false} className="w-96">
            <Stack gap="xs" className="p-4">
              <Text weight="medium">Design and components</Text>
              <Text size="sm" tone="muted">
                Compose the content through its slot.
              </Text>
            </Stack>
            <Divider />
            <Stack gap="xs" className="p-2">
              <NavigationMenuLink
                as={NextLink}
                href="/en/design/colors"
                description="Semantic colors, palettes and themes"
                icon={<Palette />}
                trailing={<Tag size="sm">Updated</Tag>}
              >
                Colors
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
