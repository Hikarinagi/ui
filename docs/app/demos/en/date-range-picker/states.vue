<script setup lang="ts">
  import { DateRangePicker, Stack } from '@hina-ui/vue'

  const range = { start: '2026-09-04', end: '2026-09-12' }
</script>

<template>
  <Stack class="w-96">
    <DateRangePicker :model-value="range" invalid aria-label="Invalid" />
    <DateRangePicker :model-value="range" disabled aria-label="Disabled" />
    <DateRangePicker :model-value="range" readonly aria-label="Read only" />
    <DateRangePicker :model-value="range" variant="secondary" aria-label="Secondary" />
  </Stack>
</template>
