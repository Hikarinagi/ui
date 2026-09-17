<script setup lang="ts">
  import { VirtualList, Tag } from '@hina-ui/vue'

  const items = Array.from({ length: 10000 }, (_, id) => ({
    id,
    label: `条目 ${String(id + 1).padStart(5, '0')}`,
  }))
</script>

<template>
  <VirtualList
    :items="items"
    :get-key="item => item.id"
    :height="320"
    :estimate-size="64"
    label="条目列表"
    class="border-line bg-surface rounded-lg border"
  >
    <template #default="{ item, index }">
      <div class="border-line flex h-16 items-center gap-3 border-b px-4">
        <span
          class="bg-inset text-muted flex size-9 shrink-0 items-center justify-center rounded-md text-xs tabular-nums"
        >
          {{ index + 1 }}
        </span>
        <span class="min-w-0 flex-1 truncate text-sm">{{ item.label }}</span>
        <Tag v-if="index % 3 === 0" size="sm">标签</Tag>
      </div>
    </template>
  </VirtualList>
</template>
