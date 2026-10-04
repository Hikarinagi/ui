<script setup lang="ts">
  import { MultiCombobox, Stack } from '@hina-ui/vue'

  const options = [
    { value: 1, label: 'Key' },
    { value: 2, label: 'Type-Moon' },
  ]
</script>

<template>
  <Stack gap="sm" class="w-full max-w-sm">
    <MultiCombobox :options="options" :model-value="[1]" invalid aria-label="校验未通过" />
    <MultiCombobox :options="options" :model-value="[1]" disabled aria-label="已禁用" />
    <MultiCombobox
      :options="options"
      :model-value="[1]"
      variant="secondary"
      aria-label="扁平形态"
    />
  </Stack>
</template>
