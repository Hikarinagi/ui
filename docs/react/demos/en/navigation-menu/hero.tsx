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
    <Stack className="min-h-96 w-full sm:min-h-64" align="start">
      <NavigationMenu label="Main navigation">
        <NavigationMenuItem value="start">
          <NavigationMenuTrigger>Start</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink
              as={NextLink}
              href="/en/guide/installation"
              description="Install and configure the library"
            >
              Installation
            </NavigationMenuLink>
            <NavigationMenuLink
              as={NextLink}
              href="/en/design/colors"
              description="Color roles and theme variables"
            >
              Colors
            </NavigationMenuLink>
            <NavigationMenuLink
              as={NextLink}
              href="/en/design/motion"
              description="Animation duration and easing"
            >
              Motion
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="components">
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent className="grid w-[30rem] gap-1 sm:grid-cols-2">
            <NavigationMenuLink
              as={NextLink}
              href="/en/components/button"
              description="Buttons and interaction feedback"
            >
              Button
            </NavigationMenuLink>
            <NavigationMenuLink
              as={NextLink}
              href="/en/components/dialog"
              description="Dialogs and custom content"
            >
              Dialog
            </NavigationMenuLink>
            <NavigationMenuLink
              as={NextLink}
              href="/en/components/form"
              description="Form state and async validation"
            >
              Form
            </NavigationMenuLink>
            <NavigationMenuLink
              as={NextLink}
              href="/en/components/data-table"
              description="Data display and column interactions"
            >
              DataTable
            </NavigationMenuLink>
          </NavigationMenuContent>
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
