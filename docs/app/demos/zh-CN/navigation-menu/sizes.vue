<script setup lang="ts">
  import { BookOpen, Code, ArrowUpRight } from '@lucide/vue'
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
  <Stack gap="lg" align="start" class="min-h-80 w-full">
    <NavigationMenu
      v-for="size in ['sm', 'md', 'lg'] as const"
      :key="size"
      :label="`${size} 导航`"
      :size="size"
    >
      <NavigationMenuItem value="docs">
        <NavigationMenuTrigger>
          <template #icon><BookOpen /></template>
          {{ size }}
        </NavigationMenuTrigger>
        <NavigationMenuContent class="w-64">
          <NavigationMenuLink href="#usage">
            <template #icon><BookOpen /></template>
            用法
          </NavigationMenuLink>
          <NavigationMenuLink href="#api">
            <template #icon><Code /></template>
            API
            <template #trailing><ArrowUpRight /></template>
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#usage" active>用法</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#api">API</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
  </Stack>
</template>
