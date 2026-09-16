<script setup lang="ts">
  import { ref } from 'vue'
  import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    Stack,
    Text,
  } from '@hina-ui/vue'

  const value = ref('')
</script>

<template>
  <Stack class="min-h-56 w-full" align="start">
    <Text size="sm" tone="muted">展开项：{{ value || '无' }}</Text>
    <NavigationMenu v-model="value" label="点击展开" trigger="click">
      <NavigationMenuItem value="links">
        <NavigationMenuTrigger>链接</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="#controlled">选择后关闭</NavigationMenuLink>
          <NavigationMenuLink href="#controlled" @select.prevent>选择后保持打开</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenu>
  </Stack>
</template>
