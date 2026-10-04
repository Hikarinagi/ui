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
    <NavigationMenu label="纵向导航" orientation="vertical" align="start" size="sm">
      <NavigationMenuItem value="design">
        <NavigationMenuTrigger>设计规范</NavigationMenuTrigger>
        <NavigationMenuContent class="w-64">
          <NavigationMenuLink :as="NuxtLink" :to="localePath('/design/colors')">
            颜色
          </NavigationMenuLink>
          <NavigationMenuLink :as="NuxtLink" :to="localePath('/design/typography')">
            排版
          </NavigationMenuLink>
          <NavigationMenuLink :as="NuxtLink" :to="localePath('/design/layout')">
            布局
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink :as="NuxtLink" :to="localePath('/components')">组件</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink :as="NuxtLink" :to="localePath('/changelog')">
          变更记录
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
  </Stack>
</template>
