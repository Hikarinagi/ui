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
    <NavigationMenu label="自定义导航">
      <NavigationMenuItem value="resources">
        <NavigationMenuTrigger>
          <template #icon><BookOpen /></template>
          资源
        </NavigationMenuTrigger>
        <NavigationMenuContent :padded="false" class="w-96">
          <Stack gap="xs" class="p-4">
            <Text weight="medium">设计与组件</Text>
            <Text size="sm" tone="muted">内容区域由插槽自由组合。</Text>
          </Stack>
          <Divider />
          <Stack gap="xs" class="p-2">
            <NavigationMenuLink
              :as="NuxtLink"
              :to="localePath('/design/colors')"
              description="语义色、表现色与主题切换"
            >
              <template #icon><Palette /></template>
              颜色规范
              <template #trailing><Tag size="sm">更新</Tag></template>
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
