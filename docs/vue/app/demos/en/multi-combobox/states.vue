<script setup lang="ts">
  import { MultiCombobox, Stack } from '@hina-ui/vue'

  const options = [
    { value: 1, label: 'Key' },
    { value: 2, label: 'Type-Moon' },
  ]
</script>

<template>
  <Stack gap="sm" class="w-full max-w-sm">
    <MultiCombobox :options="options" :model-value="[1]" invalid aria-label="Invalid" />
    <MultiCombobox :options="options" :model-value="[1]" disabled aria-label="Disabled" />
    <MultiCombobox
      :options="options"
      :model-value="[1]"
      variant="secondary"
      aria-label="Secondary"
    />
  </Stack>
</template>
