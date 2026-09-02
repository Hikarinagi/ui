<script setup lang="ts">
  import { BookOpen, Gamepad2, House, Library } from '@lucide/vue'
  import { NavLink, Stack } from '@hina-ui/vue'

  const items = [
    { icon: House, label: '首页', active: false },
    { icon: Gamepad2, label: 'Galgame', active: true },
    { icon: BookOpen, label: '轻小说', active: false },
    { icon: Library, label: '漫画', active: false },
  ]
</script>

<template>
  <Stack gap="none" as="nav" class="w-full max-w-56">
    <NavLink v-for="item in items" :key="item.label" href="#" :active="item.active">
      <template #icon><component :is="item.icon" /></template>
      {{ item.label }}
    </NavLink>
  </Stack>
</template>
