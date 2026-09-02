<script setup lang="ts">
  import { Select, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: '轻小说' },
  ]
</script>

<template>
  <Stack class="w-56">
    <Select size="sm" :options="options" model-value="gal" aria-label="小号" />
    <Select size="md" :options="options" model-value="gal" aria-label="中号" />
    <Select size="lg" :options="options" model-value="gal" aria-label="大号" />
  </Stack>
</template>
