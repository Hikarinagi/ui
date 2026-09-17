<script setup lang="ts">
  import { ref } from 'vue'
  import { VirtualList, Collapsible, CollapsibleTrigger, CollapsibleContent } from '@hina-ui/vue'

  const expanded = ref<Record<number, boolean>>({})
  const items = Array.from({ length: 500 }, (_, id) => ({
    id,
    title: `条目 ${id + 1}`,
    description: '内容自然换行，每项高度由实际内容决定。'.repeat((id % 3) + 1),
  }))
</script>

<template>
  <VirtualList
    :items="items"
    :get-key="item => item.id"
    :estimate-size="140"
    :height="360"
    label="动态高度列表"
    class="border-line rounded-lg border"
  >
    <template #default="{ item }">
      <Collapsible v-model:open="expanded[item.id]" class="border-line border-b p-4">
        <div class="text-sm font-medium">{{ item.title }}</div>
        <p class="text-muted mt-1 text-sm">{{ item.description }}</p>
        <CollapsibleTrigger class="mt-2">
          {{ expanded[item.id] ? '收起' : '展开' }}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p class="text-muted pt-2 text-sm">
            {{ '展开后增加的内容会自动参与高度计算。'.repeat(5) }}
          </p>
        </CollapsibleContent>
      </Collapsible>
    </template>
  </VirtualList>
</template>
