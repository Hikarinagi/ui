<script setup lang="ts">
  import { DateRangePicker, Stack } from '@hina-ui/vue'

  const range = { start: '2026-09-04', end: '2026-09-12' }
</script>

<template>
  <Stack class="w-96">
    <DateRangePicker size="sm" :model-value="range" aria-label="Small" />
    <DateRangePicker size="md" :model-value="range" aria-label="Medium" />
    <DateRangePicker size="lg" :model-value="range" aria-label="Large" />
  </Stack>
</template>
