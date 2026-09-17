<script setup lang="ts">
  import { ref } from 'vue'
  import {
    VirtualList,
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
    Text,
  } from '@hina-ui/vue'

  const expanded = ref<Record<number, boolean>>({})
  const items = Array.from({ length: 500 }, (_, id) => ({
    id,
    title: `Item ${id + 1}`,
    description: 'Text wraps naturally and determines the height of each item. '.repeat(
      (id % 3) + 1,
    ),
  }))
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
      <Collapsible v-model:open="expanded[item.id]" class="border-line border-b p-4">
        <Text size="sm" weight="medium">{{ item.title }}</Text>
        <Text size="sm" tone="muted" class="mt-1">{{ item.description }}</Text>
        <CollapsibleTrigger class="mt-2">
          {{ expanded[item.id] ? 'Collapse' : 'Expand' }}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Text size="sm" tone="muted" class="pt-2">
            {{ 'Expanded content is measured automatically. '.repeat(5) }}
          </Text>
        </CollapsibleContent>
      </Collapsible>
    </template>
  </VirtualList>
</template>
