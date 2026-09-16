<script setup lang="ts">
  import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from '@hina-ui/vue'
</script>

<template>
  <NavigationMenu label="页面导航">
    <NavigationMenuItem>
      <NavigationMenuLink href="#usage" active>用法</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#examples">示例</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#api">API</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenu>
</template>
