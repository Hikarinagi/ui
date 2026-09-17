<script setup lang="ts">
  import { VirtualList } from '@hina-ui/vue'
  const items = Array.from({ length: 200 }, (_, id) => ({ id, label: `条目 ${id + 1}` }))
</script>

<template>
  <div class="w-full space-y-4">
    <div v-for="dir in ['ltr', 'rtl'] as const" :key="dir">
      <div class="text-muted mb-2 text-xs uppercase">{{ dir }}</div>
      <VirtualList
        :items="items"
        :get-key="item => item.id"
        orientation="horizontal"
        :dir="dir"
        :height="144"
        :estimate-size="160"
        :dynamic="false"
        :gap="12"
        :label="`${dir} 横向列表`"
      >
        <template #default="{ item, index }">
          <div
            class="border-line bg-surface flex h-full flex-col justify-between rounded-lg border p-4"
          >
            <span class="text-muted text-2xl tabular-nums">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <span class="text-sm">{{ item.label }}</span>
          </div>
        </template>
      </VirtualList>
    </div>
  </div>
</template>
