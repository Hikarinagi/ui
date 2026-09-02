<script setup lang="ts">
  import { Select, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: 'Light novel' },
  ]
</script>

<template>
  <Stack class="w-56">
    <Select size="sm" :options="options" model-value="gal" aria-label="Small" />
    <Select size="md" :options="options" model-value="gal" aria-label="Medium" />
    <Select size="lg" :options="options" model-value="gal" aria-label="Large" />
  </Stack>
</template>
