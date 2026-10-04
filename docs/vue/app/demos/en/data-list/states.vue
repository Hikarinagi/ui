<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { DataList, Image, SegmentedControl, Stack, Text } from '@hina-ui/vue'
  import { dataListDemo } from '../../data-list'
  const items = dataListDemo('en')
  const state = ref('initial')
  const options = [
    { value: 'initial', label: 'Initial' },
    { value: 'ready', label: 'Ready' },
    { value: 'refresh', label: 'Refresh' },
    { value: 'empty', label: 'Empty' },
  ]
  const rows = computed(() =>
    state.value === 'initial' || state.value === 'empty' ? [] : items.slice(0, 2),
  )
</script>
<template>
  <Stack class="w-full max-w-2xl">
    <SegmentedControl v-model="state" :options="options" size="sm" aria-label="List state" />
    <DataList
      :items="rows"
      item-key="id"
      item-title="title"
      item-description="subtitle"
      :loading="state === 'initial' || state === 'refresh'"
      :placeholder-count="2"
      :media-ratio="3 / 4"
      :height="280"
      label="Items"
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
