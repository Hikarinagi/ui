<script setup lang="ts">
  import { MultiCombobox, Stack } from '@hina-ui/vue'

  const options = [
    { value: 1, label: 'Key' },
    { value: 2, label: 'Type-Moon' },
  ]
</script>

<template>
  <Stack gap="sm" class="w-full max-w-sm">
    <MultiCombobox size="sm" :options="options" :model-value="[1]" aria-label="小号" />
    <MultiCombobox size="md" :options="options" :model-value="[1]" aria-label="中号" />
    <MultiCombobox size="lg" :options="options" :model-value="[1]" aria-label="大号" />
  </Stack>
</template>
