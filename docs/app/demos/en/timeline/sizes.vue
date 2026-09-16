<script setup lang="ts">
  import { SimpleGrid, Stack, Text, Timeline, type TimelineSize } from '@hina-ui/vue'

  const sizes: TimelineSize[] = ['sm', 'md', 'lg']
  const items = [
    {
      id: 'a',
      title: 'Item A',
      description: 'A description for the first item.',
      time: '09:00',
      dateTime: '2026-09-16T09:00:00+08:00',
    },
    {
      id: 'b',
      title: 'Item B',
      description:
        'This longer description wraps onto multiple lines. The connector extends with the content, keeping the next event below it.',
      time: '09:20',
      dateTime: '2026-09-16T09:20:00+08:00',
    },
    {
      id: 'c',
      title: 'Item C',
      description: 'The connector ends at the last item.',
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
