<script setup lang="ts">
  import { MultiCombobox, Stack } from '@hina-ui/vue'

  const options = [
    { value: 1, label: 'Key' },
    { value: 2, label: 'Type-Moon' },
  ]
</script>

<template>
  <Stack gap="sm" class="w-full max-w-sm">
    <MultiCombobox size="sm" :options="options" :model-value="[1]" aria-label="Small" />
    <MultiCombobox size="md" :options="options" :model-value="[1]" aria-label="Medium" />
    <MultiCombobox size="lg" :options="options" :model-value="[1]" aria-label="Large" />
  </Stack>
</template>
