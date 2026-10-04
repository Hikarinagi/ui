<script setup lang="ts">
  import { Combobox, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: 'Light novel' },
  ]
</script>

<template>
  <Stack class="w-64">
    <Combobox size="sm" :options="options" model-value="gal" aria-label="Small" />
    <Combobox size="md" :options="options" model-value="gal" aria-label="Medium" />
    <Combobox size="lg" :options="options" model-value="gal" aria-label="Large" />
  </Stack>
</template>
