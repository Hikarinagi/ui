<script setup lang="ts">
  import { MultiSelect, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'school', label: '校园' },
    { value: 'sf', label: '科幻' },
    { value: 'romance', label: '恋爱' },
  ]
</script>

<template>
  <Stack class="w-72">
    <MultiSelect size="sm" :options="options" :model-value="['school', 'sf']" aria-label="小号" />
    <MultiSelect size="md" :options="options" :model-value="['school', 'sf']" aria-label="中号" />
    <MultiSelect size="lg" :options="options" :model-value="['school', 'sf']" aria-label="大号" />
  </Stack>
</template>
