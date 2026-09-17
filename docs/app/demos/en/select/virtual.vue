<script setup lang="ts">
  import { ref } from 'vue'
  import { Select, Stack, Text } from '@hina-ui/vue'

  const selected = ref<string | number | null>(7890)
  const options = Array.from({ length: 10000 }, (_, index) => ({
    value: index,
    label: `Item ${String(index + 1).padStart(5, '0')}`,
    disabled: index % 97 === 0,
  }))
</script>

<template>
  <Stack gap="sm" class="w-full">
    <Select
      v-model="selected"
      :options="options"
      :virtualize="{ estimateSize: 36, overscan: 6 }"
      aria-label="Ten thousand items"
      class="w-full"
    />
    <Text size="sm" tone="muted">Selected: {{ selected }}</Text>
  </Stack>
</template>
