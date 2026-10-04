<script setup lang="ts">
  import { NuxtLink } from '#components'
  import { BookOpen, ArrowUpRight, Palette } from '@lucide/vue'
  import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    Stack,
    Text,
    Tag,
    Divider,
  } from '@hina-ui/vue'

  const localePath = useLocalePath()
</script>

<template>
  <Stack class="min-h-72 w-full" align="start">
    <NavigationMenu label="Custom navigation">
      <NavigationMenuItem value="resources">
        <NavigationMenuTrigger>
          <template #icon><BookOpen /></template>
          Resources
        </NavigationMenuTrigger>
        <NavigationMenuContent :padded="false" class="w-96">
          <Stack gap="xs" class="p-4">
            <Text weight="medium">Design and components</Text>
            <Text size="sm" tone="muted">Compose the content through its slot.</Text>
          </Stack>
          <Divider />
          <Stack gap="xs" class="p-2">
            <NavigationMenuLink
              :as="NuxtLink"
              :to="localePath('/design/colors')"
              description="Semantic colors, palettes and themes"
            >
              <template #icon><Palette /></template>
              Colors
              <template #trailing><Tag size="sm">Updated</Tag></template>
            </NavigationMenuLink>
            <NavigationMenuLink
              href="https://github.com/Hikarinagi/ui"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <template #trailing><ArrowUpRight /></template>
            </NavigationMenuLink>
          </Stack>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenu>
  </Stack>
</template>
