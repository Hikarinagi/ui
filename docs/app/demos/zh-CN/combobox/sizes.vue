<script setup lang="ts">
  import { Combobox, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: '轻小说' },
  ]
</script>

<template>
  <Stack class="w-64">
    <Combobox size="sm" :options="options" model-value="gal" aria-label="小号" />
    <Combobox size="md" :options="options" model-value="gal" aria-label="中号" />
    <Combobox size="lg" :options="options" model-value="gal" aria-label="大号" />
  </Stack>
</template>
