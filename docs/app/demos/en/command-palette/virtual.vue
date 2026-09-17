<script setup lang="ts">
  import { ref } from 'vue'
  import { CommandPalette, Stack, Text } from '@hina-ui/vue'

  const selected = ref('—')
  const items = Array.from({ length: 10000 }, (_, index) => ({
    id: String(index),
    label: `Item ${String(index + 1).padStart(5, '0')}`,
    keywords: [`id-${index}`],
  }))
</script>

<template>
  <Stack gap="sm" class="w-full">
    <CommandPalette
      :items="items"
      :virtualize="{ estimateSize: 36, overscan: 6 }"
      inline
      aria-label="Ten thousand items"
      class="w-full"
      @select="selected = $event.label"
    />
    <Text size="sm" tone="muted">Selected: {{ selected }}</Text>
  </Stack>
</template>
