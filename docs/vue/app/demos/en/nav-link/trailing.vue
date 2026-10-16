<script setup lang="ts">
  import { NavLink, Stack, Text } from '@hina-ui/vue'

  const chapters = [
    { title: 'Prologue', pages: '3 pages' },
    {
      title: 'Chapter 1: After the rain, only the two of us were left on the platform',
      pages: '28 pages',
      active: true,
    },
    { title: 'Chapter 2: Summer festival', pages: '19 pages' },
    { title: 'Epilogue', pages: '6 pages' },
  ]
</script>

<template>
  <Stack gap="none" as="nav" class="w-full max-w-56">
    <NavLink v-for="chapter in chapters" :key="chapter.title" href="#" :active="chapter.active">
      {{ chapter.title }}
      <template #trailing>
        <Text as="span" size="sm" tone="faint" class="tabular-nums">{{ chapter.pages }}</Text>
      </template>
    </NavLink>
  </Stack>
</template>
