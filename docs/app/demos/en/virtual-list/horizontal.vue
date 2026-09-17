<script setup lang="ts">
  import { VirtualList, Stack, Text } from '@hina-ui/vue'
  const items = Array.from({ length: 200 }, (_, id) => ({ id, label: `Item ${id + 1}` }))
</script>

<template>
  <Stack class="w-full">
    <Stack v-for="dir in ['ltr', 'rtl'] as const" :key="dir" gap="sm">
      <Text size="xs" tone="muted" class="uppercase">{{ dir }}</Text>
      <VirtualList
        :items="items"
        :get-key="item => item.id"
        orientation="horizontal"
        :dir="dir"
        :height="144"
        :estimate-size="160"
        :dynamic="false"
        :gap="12"
        :label="`${dir} Horizontal list`"
      >
        <template #default="{ item, index }">
          <Stack
            justify="between"
            gap="sm"
            class="border-line bg-surface h-full rounded-lg border p-4"
          >
            <Text size="2xl" tone="muted" class="tabular-nums">
              {{ String(index + 1).padStart(2, '0') }}
            </Text>
            <Text size="sm">{{ item.label }}</Text>
          </Stack>
        </template>
      </VirtualList>
    </Stack>
  </Stack>
</template>
