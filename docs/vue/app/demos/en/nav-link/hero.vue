<script setup lang="ts">
  import { BookOpen, Gamepad2, House, Library } from '@lucide/vue'
  import { NavLink, Stack } from '@hina-ui/vue'

  const items = [
    { icon: House, label: 'Home', active: false },
    { icon: Gamepad2, label: 'Galgame', active: true },
    { icon: BookOpen, label: 'Light novels', active: false },
    { icon: Library, label: 'Manga', active: false },
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
