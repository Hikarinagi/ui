<script setup lang="ts">
  import { RadioGroup, Inline } from '@hina-ui/vue'

  const options = [
    { value: 'wish', label: '想看' },
    { value: 'doing', label: '在看' },
  ]
</script>

<template>
  <Inline gap="lg" align="start">
    <RadioGroup size="sm" :options="options" model-value="wish" aria-label="小号" />
    <RadioGroup size="md" :options="options" model-value="wish" aria-label="中号" />
    <RadioGroup size="lg" :options="options" model-value="wish" aria-label="大号" />
  </Inline>
</template>
