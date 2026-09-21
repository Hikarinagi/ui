<script setup lang="ts">
  import { ref } from 'vue'
  import { Listbox, Stack, Text } from '@hina-ui/vue'

  const selected = ref<string | number | null>(7890)
  const options = Array.from({ length: 10000 }, (_, index) => ({
    value: index,
    label: `条目 ${String(index + 1).padStart(5, '0')}`,
    disabled: index % 97 === 0,
  }))
</script>

<template>
  <Stack gap="sm" class="w-56 max-w-full">
    <Listbox
      v-model="selected"
      :options="options"
      :virtualize="{ estimateSize: 36, overscan: 6 }"
      aria-label="一万项"
    />
    <Text size="sm" tone="muted">已选: {{ selected }}</Text>
  </Stack>
</template>
