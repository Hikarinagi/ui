'use client'

import { useState } from 'react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  Stack,
  Text,
} from '@hina-ui/react'

export default function Demo() {
  const [value, setValue] = useState('')
  return (
    <Stack className="min-h-56 w-full" align="start">
      <Text size="sm" tone="muted">
        Open item: {value || 'None'}
      </Text>
      <NavigationMenu value={value} onValueChange={setValue} label="Click to open" trigger="click">
        <NavigationMenuItem value="links">
          <NavigationMenuTrigger>Links</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#controlled">Close after selection</NavigationMenuLink>
            <NavigationMenuLink href="#controlled" onSelect={event => event.preventDefault()}>
              Stay open after selection
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenu>
    </Stack>
  )
}
