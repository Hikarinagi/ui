<script setup lang="ts">
  import { NavLink, Stack, Text } from '@hina-ui/vue'

  const chapters = [
    { title: '序章', pages: '3 页' },
    { title: '第一章 雨停之后，站台上只剩下我们两个人', pages: '28 页', active: true },
    { title: '第二章 夏祭', pages: '19 页' },
    { title: '终章', pages: '6 页' },
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
