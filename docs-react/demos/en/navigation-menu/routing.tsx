import NextLink from 'next/link'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from '@hina-ui/react'

export default function Demo() {
  return (
    <NavigationMenu label="Router navigation">
      <NavigationMenuItem>
        <NavigationMenuLink asChild active>
          <NextLink href="/en/components/navigation-menu">NavigationMenu</NextLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <NextLink href="/en/components/toolbar">Toolbar</NextLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
  )
}
