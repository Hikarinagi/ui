import { expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '../../exports/navigation'

it.each(['', 'learn'])(
  'renders all navigation parts from package exports with state %s',
  async modelValue => {
    const html = renderToString(
      <NavigationMenu label="Navigation" dir="rtl" value={modelValue}>
        <NavigationMenuItem value="learn">
          <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#start">Start</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#about" active>
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>,
    )
    expect(html).toContain('<nav')
    expect(html).toContain('aria-label="Navigation"')
    expect(html).toContain('dir="rtl"')
    expect(html).toContain('aria-current="page"')
    expect(html).toContain(`aria-expanded="${!!modelValue}"`)
    if (modelValue) expect(html).toContain('href="#start"')
  },
)
