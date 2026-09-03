<script setup lang="ts">
  import { RadioGroup, Inline } from '@hina-ui/vue'

  const options = [
    { value: 'wish', label: 'Want to read' },
    { value: 'doing', label: 'Reading' },
  ]
</script>

<template>
  <Inline gap="lg" align="start">
    <RadioGroup size="sm" :options="options" model-value="wish" aria-label="Small" />
    <RadioGroup size="md" :options="options" model-value="wish" aria-label="Medium" />
    <RadioGroup size="lg" :options="options" model-value="wish" aria-label="Large" />
  </Inline>
</template>
