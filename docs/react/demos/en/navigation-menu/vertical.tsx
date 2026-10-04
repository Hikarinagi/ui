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
      <NavigationMenu label="Vertical navigation" orientation="vertical" align="start" size="sm">
        <NavigationMenuItem value="design">
          <NavigationMenuTrigger>Design</NavigationMenuTrigger>
          <NavigationMenuContent className="w-64">
            <NavigationMenuLink as={NextLink} href="/en/design/colors">
              Colors
            </NavigationMenuLink>
            <NavigationMenuLink as={NextLink} href="/en/design/typography">
              Typography
            </NavigationMenuLink>
            <NavigationMenuLink as={NextLink} href="/en/design/layout">
              Layout
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink as={NextLink} href="/en/components">
            Components
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink as={NextLink} href="/en/changelog">
            Changelog
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>
    </Stack>
  )
}
