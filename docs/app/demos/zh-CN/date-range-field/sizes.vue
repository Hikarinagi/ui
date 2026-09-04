<script setup lang="ts">
  import { DateRangeField, Stack } from '@hina-ui/vue'

  const range = { start: '2026-09-01', end: '2026-09-30' }
</script>

<template>
  <Stack class="w-96">
    <DateRangeField size="sm" :model-value="range" aria-label="小号" />
    <DateRangeField size="md" :model-value="range" aria-label="中号" />
    <DateRangeField size="lg" :model-value="range" aria-label="大号" />
  </Stack>
</template>
