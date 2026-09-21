<script setup lang="ts">
  import { ref } from 'vue'
  import { TreeSelect, Stack, Text } from '@hina-ui/vue'

  const selected = ref<string | number | null>(7890)
  const options = Array.from({ length: 10000 }, (_, index) => ({
    value: index,
    label: `Item ${String(index + 1).padStart(5, '0')}`,
    disabled: index % 97 === 0,
  }))
  const items = [{ value: 'root', label: 'All nodes', children: options }]
</script>

<template>
  <Stack gap="sm" class="w-64 max-w-full">
    <TreeSelect
      v-model="selected"
      :items="items"
      :default-expanded="['root']"
      :virtualize="{ estimateSize: 36, overscan: 6 }"
      searchable
      aria-label="Ten thousand items"
    />
    <Text size="sm" tone="muted">Selected: {{ selected }}</Text>
  </Stack>
</template>
