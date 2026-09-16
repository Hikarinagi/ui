<script setup lang="ts">
  import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    Stack,
  } from '@hina-ui/vue'
</script>

<template>
  <Stack class="min-h-56 w-full" dir="rtl" align="start">
    <NavigationMenu label="RTL navigation" align="start">
      <NavigationMenuItem value="first">
        <NavigationMenuTrigger>First</NavigationMenuTrigger>
        <NavigationMenuContent class="w-64">
          <NavigationMenuLink href="#rtl">Link one</NavigationMenuLink>
          <NavigationMenuLink href="#rtl">Link two</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#usage">Second</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#api">Third</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
  </Stack>
</template>
