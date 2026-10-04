import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from '@hina-ui/react'

export default function Demo() {
  return (
    <NavigationMenu label="Navigation states" size="sm">
      <NavigationMenuItem>
        <NavigationMenuLink href="#states" active>
          Current
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#api">Link</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger disabled>Disabled panel</NavigationMenuTrigger>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#states" disabled>
          Disabled link
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
  )
}
