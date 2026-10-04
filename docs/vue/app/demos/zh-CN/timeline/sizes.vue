<script setup lang="ts">
  import { SimpleGrid, Stack, Text, Timeline, type TimelineSize } from '@hina-ui/vue'

  const sizes: TimelineSize[] = ['sm', 'md', 'lg']
  const items = [
    {
      id: 'a',
      title: '条目 A',
      description: '第一项的说明文字。',
      time: '09:00',
      dateTime: '2026-09-16T09:00:00+08:00',
    },
    {
      id: 'b',
      title: '条目 B',
      description:
        '这一项包含更长的说明文字，换行后节点之间的连线仍然连续，后面的内容随之向下排列。',
      time: '09:20',
      dateTime: '2026-09-16T09:20:00+08:00',
    },
    {
      id: 'c',
      title: '条目 C',
      description: '最后一项不继续绘制连线。',
      time: '09:40',
      dateTime: '2026-09-16T09:40:00+08:00',
    },
  ]
</script>

<template>
  <SimpleGrid min="12rem" class="w-full" gap="lg">
    <Stack v-for="size in sizes" :key="size">
      <Text size="sm" tone="muted">{{ size }}</Text>
      <Timeline :items="items" :size="size" />
    </Stack>
  </SimpleGrid>
</template>
