<script setup lang="ts">
  import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from '@hina-ui/vue'

  const localePath = useLocalePath()
</script>

<template>
  <NavigationMenu label="路由导航">
    <NavigationMenuItem>
      <NavigationMenuLink as-child active>
        <NuxtLink :to="localePath('/components/navigation-menu')">NavigationMenu</NuxtLink>
      </NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink as-child>
        <NuxtLink :to="localePath('/components/toolbar')">Toolbar</NuxtLink>
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenu>
</template>
