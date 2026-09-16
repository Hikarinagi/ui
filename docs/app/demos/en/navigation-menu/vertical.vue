<script setup lang="ts">
  import { NuxtLink } from '#components'
  import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    Stack,
  } from '@hina-ui/vue'

  const localePath = useLocalePath()
</script>

<template>
  <Stack class="min-h-56 w-full" align="start">
    <NavigationMenu label="Vertical navigation" orientation="vertical" align="start" size="sm">
      <NavigationMenuItem value="design">
        <NavigationMenuTrigger>Design</NavigationMenuTrigger>
        <NavigationMenuContent class="w-64">
          <NavigationMenuLink :as="NuxtLink" :to="localePath('/design/colors')">
            Colors
          </NavigationMenuLink>
          <NavigationMenuLink :as="NuxtLink" :to="localePath('/design/typography')">
            Typography
          </NavigationMenuLink>
          <NavigationMenuLink :as="NuxtLink" :to="localePath('/design/layout')">
            Layout
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink :as="NuxtLink" :to="localePath('/components')">
          Components
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink :as="NuxtLink" :to="localePath('/changelog')">
          Changelog
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
  </Stack>
</template>
