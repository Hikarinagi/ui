<script setup lang="ts">
  import { ref } from 'vue'
  import { VirtualList, Button } from '@hina-ui/vue'

  const expanded = ref(new Set<number>())
  const items = Array.from({ length: 500 }, (_, id) => ({
    id,
    title: `Item ${id + 1}`,
    description: 'Text wraps naturally and determines the height of each item. '.repeat(
      (id % 3) + 1,
    ),
  }))
  function toggle(id: number) {
    if (expanded.value.has(id)) expanded.value.delete(id)
    else expanded.value.add(id)
  }
</script>

<template>
  <VirtualList
    :items="items"
    :get-key="item => item.id"
    :estimate-size="140"
    :height="360"
    label="Dynamic-size list"
    class="border-line rounded-lg border"
  >
    <template #default="{ item }">
      <div class="border-line border-b p-4">
        <div class="text-sm font-medium">{{ item.title }}</div>
        <p class="text-muted mt-1 text-sm">{{ item.description }}</p>
        <p v-if="expanded.has(item.id)" class="text-muted mt-2 text-sm">
          {{ 'Expanded content is measured automatically. '.repeat(5) }}
        </p>
        <Button
          size="sm"
          variant="ghost"
          class="mt-2"
          :aria-expanded="expanded.has(item.id)"
          @click="toggle(item.id)"
        >
          {{ expanded.has(item.id) ? 'Collapse' : 'Expand' }}
        </Button>
      </div>
    </template>
  </VirtualList>
</template>
