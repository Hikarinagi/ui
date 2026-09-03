<script setup lang="ts">
  import { RadioGroup, Inline } from '@hina-ui/vue'

  const options = [
    { value: 'wish', label: 'Want to read' },
    { value: 'doing', label: 'Reading' },
    { value: 'done', label: 'Finished', disabled: true },
  ]
</script>

<template>
  <Inline gap="lg" align="start">
    <RadioGroup :options="options" model-value="wish" aria-label="With a disabled option" />
    <RadioGroup disabled :options="options" model-value="wish" aria-label="Disabled group" />
    <RadioGroup invalid :options="options" aria-label="Invalid" />
  </Inline>
</template>
