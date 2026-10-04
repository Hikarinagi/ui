import NextLink from 'next/link'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from '@hina-ui/react'

export default function Demo() {
  return (
    <NavigationMenu label="路由导航">
      <NavigationMenuItem>
        <NavigationMenuLink asChild active>
          <NextLink href="/components/navigation-menu">NavigationMenu</NextLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <NextLink href="/components/toolbar">Toolbar</NextLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
  )
}
