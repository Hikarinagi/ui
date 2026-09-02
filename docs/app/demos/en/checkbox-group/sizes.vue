<script setup lang="ts">
  import { CheckboxGroup, Inline } from '@hina-ui/vue'

  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: 'Light novel' },
  ]
</script>

<template>
  <Inline gap="lg" align="start">
    <CheckboxGroup size="sm" :options="options" :model-value="['gal']" aria-label="Small" />
    <CheckboxGroup size="md" :options="options" :model-value="['gal']" aria-label="Medium" />
    <CheckboxGroup size="lg" :options="options" :model-value="['gal']" aria-label="Large" />
  </Inline>
</template>
