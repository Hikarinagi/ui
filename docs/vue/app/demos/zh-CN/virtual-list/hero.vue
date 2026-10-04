<script setup lang="ts">
  import { VirtualList, Tag, Inline, Text } from '@hina-ui/vue'

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
      <Inline :wrap="false" class="border-line h-16 border-b px-4">
        <Text
          as="span"
          size="xs"
          tone="muted"
          class="bg-inset flex size-9 shrink-0 items-center justify-center rounded-md tabular-nums"
        >
          {{ index + 1 }}
        </Text>
        <Text as="span" size="sm" truncate class="min-w-0 flex-1">{{ item.label }}</Text>
        <Tag v-if="index % 3 === 0" size="sm">标签</Tag>
      </Inline>
    </template>
  </VirtualList>
</template>
