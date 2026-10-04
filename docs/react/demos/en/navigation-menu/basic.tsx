import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from '@hina-ui/react'

export default function Demo() {
  return (
    <NavigationMenu label="Page navigation">
      <NavigationMenuItem>
        <NavigationMenuLink href="#usage" active>
          Usage
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#examples">Examples</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#api">API</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
  )
}
