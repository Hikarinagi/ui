<script setup lang="ts">
  import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuLink,
  } from '@hina-ui/vue'
</script>

<template>
  <NavigationMenu label="Navigation states" size="sm">
    <NavigationMenuItem>
      <NavigationMenuLink href="#states" active>Current</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#api">Link</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuTrigger disabled>Disabled panel</NavigationMenuTrigger>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#states" disabled>Disabled link</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenu>
</template>
