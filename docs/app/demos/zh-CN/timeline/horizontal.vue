<script setup lang="ts">
  import { ref } from 'vue'
  import { Timeline, Select, Stack, ScrollArea, type TimelineAlign } from '@hina-ui/vue'

  const align = ref<TimelineAlign>('start')
  const options = [
    { value: 'start', label: 'start' },
    { value: 'end', label: 'end' },
    { value: 'alternate', label: 'alternate' },
  ]
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
  <Stack class="w-full" gap="lg">
    <Select v-model="align" :options="options" aria-label="对齐方式" class="w-40" />
    <ScrollArea direction="horizontal" :shadow="false" class="w-full">
      <Timeline :items="items" orientation="horizontal" :align="align" class="min-w-lg" />
    </ScrollArea>
  </Stack>
</template>
