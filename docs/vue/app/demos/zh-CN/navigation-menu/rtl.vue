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
    <NavigationMenu label="RTL 导航" align="start">
      <NavigationMenuItem value="first">
        <NavigationMenuTrigger>第一项</NavigationMenuTrigger>
        <NavigationMenuContent class="w-64">
          <NavigationMenuLink href="#rtl">链接一</NavigationMenuLink>
          <NavigationMenuLink href="#rtl">链接二</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#usage">第二项</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#api">第三项</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
  </Stack>
</template>
