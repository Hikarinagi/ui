<script setup lang="ts">
  import { ref } from 'vue'
  import { DataList, Image, Text, type DataListLayout } from '@hina-ui/vue'
  import { dataListVirtualDemo } from '../../data-list-virtual'
  const items = dataListVirtualDemo('en')
  const layout = ref<DataListLayout>('list')
  const range = ref({ startIndex: -1, endIndex: -1 })
</script>
<template>
  <DataList
    v-model:layout="layout"
    :items="items"
    item-key="id"
    item-title="title"
    item-description="subtitle"
    layout-toggle
    :media-ratio="layout === 'grid' ? 16 / 10 : 3 / 4"
    grid-min="12rem"
    :height="400"
    :virtualize="{ estimateSize: layout === 'grid' ? 280 : 128, overscan: 1 }"
    body-class="border-line rounded-lg border"
    content-class="p-4"
    label="Virtualized items"
    class="max-w-2xl"
    @range-change="range = $event"
  >
    <template #media="{ item }">
      <Image :src="item.cover.src" alt="" fit="cover" class="size-full" />
    </template>
    <template #meta="{ item }">
      <Text size="xs" tone="muted">{{ item.released }}</Text>
    </template>
    <template #footer>
      <Text size="xs" tone="muted">
        Visible: {{ range.startIndex + 1 }}–{{ range.endIndex + 1 }} / {{ items.length }}
      </Text>
    </template>
  </DataList>
</template>
