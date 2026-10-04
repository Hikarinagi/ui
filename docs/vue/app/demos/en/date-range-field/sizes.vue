<script setup lang="ts">
  import { DateRangeField, Stack } from '@hina-ui/vue'

  const range = { start: '2026-09-01', end: '2026-09-30' }
</script>

<template>
  <Stack class="w-96">
    <DateRangeField size="sm" :model-value="range" aria-label="Small" />
    <DateRangeField size="md" :model-value="range" aria-label="Medium" />
    <DateRangeField size="lg" :model-value="range" aria-label="Large" />
  </Stack>
</template>
