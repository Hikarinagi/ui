import { BookOpen, Code, ArrowUpRight } from 'lucide-react'
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
    <Stack gap="lg" align="start" className="min-h-80 w-full">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <NavigationMenu key={size} label={`${size} 导航`} size={size}>
          <NavigationMenuItem value="docs">
            <NavigationMenuTrigger icon={<BookOpen />}>{size}</NavigationMenuTrigger>
            <NavigationMenuContent className="w-64">
              <NavigationMenuLink href="#usage" icon={<BookOpen />}>
                用法
              </NavigationMenuLink>
              <NavigationMenuLink href="#api" icon={<Code />} trailing={<ArrowUpRight />}>
                API
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#usage" active>
              用法
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#api">API</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenu>
      ))}
    </Stack>
  )
}
