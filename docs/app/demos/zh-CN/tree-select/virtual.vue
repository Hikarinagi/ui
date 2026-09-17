<script setup lang="ts">
  import { ref } from 'vue'
  import { TreeSelect, Stack, Text } from '@hina-ui/vue'

  const selected = ref<string | number | null>(7890)
  const options = Array.from({ length: 10000 }, (_, index) => ({
    value: index,
    label: `条目 ${String(index + 1).padStart(5, '0')}`,
    disabled: index % 97 === 0,
  }))
  const items = [{ value: 'root', label: '全部节点', children: options }]
</script>

<template>
  <Stack gap="sm" class="w-full">
    <TreeSelect
      v-model="selected"
      :items="items"
      :default-expanded="['root']"
      :virtualize="{ estimateSize: 36, overscan: 6 }"
      searchable
      aria-label="一万项"
      class="w-full"
    />
    <Text size="sm" tone="muted">已选: {{ selected }}</Text>
  </Stack>
</template>
