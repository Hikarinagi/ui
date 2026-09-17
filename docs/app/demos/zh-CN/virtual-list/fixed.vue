<script setup lang="ts">
  import { VirtualList, Inline, Text } from '@hina-ui/vue'
  const items = Array.from({ length: 1000 }, (_, id) => ({ id, label: `条目 ${id + 1}` }))
</script>

<template>
  <VirtualList
    :items="items"
    :get-key="item => item.id"
    :height="240"
    :estimate-size="48"
    :dynamic="false"
    label="固定高度列表"
    class="border-line rounded-lg border"
  >
    <template #default="{ item, index }">
      <Inline justify="between" gap="sm" :wrap="false" class="border-line h-full border-b px-4">
        <Text as="span" size="sm">{{ item.label }}</Text>
        <Text as="span" size="sm" tone="muted" class="tabular-nums">
          {{ index + 1 }} / {{ items.length }}
        </Text>
      </Inline>
    </template>
  </VirtualList>
</template>
