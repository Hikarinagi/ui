<script setup lang="ts">
  import { CheckboxGroup, Inline } from '@hina-ui/vue'

  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: '轻小说' },
  ]
</script>

<template>
  <Inline gap="lg" align="start">
    <CheckboxGroup size="sm" :options="options" :model-value="['gal']" aria-label="小号" />
    <CheckboxGroup size="md" :options="options" :model-value="['gal']" aria-label="中号" />
    <CheckboxGroup size="lg" :options="options" :model-value="['gal']" aria-label="大号" />
  </Inline>
</template>
