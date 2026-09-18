<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { DataList, Image, SegmentedControl, Stack, Text } from '@hina-ui/vue'
  import { dataListDemo } from '../../data-list'
  const items = dataListDemo('zh-CN')
  const state = ref('initial')
  const options = [
    { value: 'initial', label: '首次加载' },
    { value: 'ready', label: '内容' },
    { value: 'refresh', label: '刷新' },
    { value: 'empty', label: '空态' },
  ]
  const rows = computed(() =>
    state.value === 'initial' || state.value === 'empty' ? [] : items.slice(0, 2),
  )
</script>
<template>
  <Stack class="w-full max-w-2xl">
    <SegmentedControl v-model="state" :options="options" size="sm" aria-label="列表状态" />
    <DataList
      :items="rows"
      item-key="id"
      item-title="title"
      item-description="subtitle"
      :loading="state === 'initial' || state === 'refresh'"
      :placeholder-count="2"
      :media-ratio="3 / 4"
      :height="280"
      label="条目"
    >
      <template #media="{ item }">
        <Image :src="item.cover.src" alt="" fit="cover" class="size-full" />
      </template>
      <template #meta="{ item }">
        <Text size="xs" tone="muted">{{ item.released }}</Text>
      </template>
    </DataList>
  </Stack>
</template>
