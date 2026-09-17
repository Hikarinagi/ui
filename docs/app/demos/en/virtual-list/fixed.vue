<script setup lang="ts">
  import { VirtualList } from '@hina-ui/vue'
  const items = Array.from({ length: 1000 }, (_, id) => ({ id, label: `Item ${id + 1}` }))
</script>

<template>
  <VirtualList
    :items="items"
    :get-key="item => item.id"
    :height="240"
    :estimate-size="48"
    :dynamic="false"
    label="Fixed-size list"
    class="border-line rounded-lg border"
  >
    <template #default="{ item, index }">
      <div class="border-line flex h-full items-center justify-between border-b px-4 text-sm">
        <span>{{ item.label }}</span>
        <span class="text-muted tabular-nums">{{ index + 1 }} / {{ items.length }}</span>
      </div>
    </template>
  </VirtualList>
</template>
