<script setup lang="ts">
  import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuLink,
  } from '@hina-ui/vue'
</script>

<template>
  <NavigationMenu label="导航状态" size="sm">
    <NavigationMenuItem>
      <NavigationMenuLink href="#states" active>当前页</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#api">普通链接</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuTrigger disabled>禁用面板</NavigationMenuTrigger>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#states" disabled>禁用链接</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenu>
</template>
