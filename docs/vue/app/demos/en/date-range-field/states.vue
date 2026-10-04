<script setup lang="ts">
  import { DateRangeField, Stack } from '@hina-ui/vue'

  const range = { start: '2026-09-01', end: '2026-09-30' }
</script>

<template>
  <Stack class="w-96">
    <DateRangeField :model-value="range" invalid aria-label="Invalid" />
    <DateRangeField :model-value="range" disabled aria-label="Disabled" />
    <DateRangeField :model-value="range" readonly aria-label="Read only" />
    <DateRangeField :model-value="range" variant="secondary" aria-label="Secondary" />
  </Stack>
</template>
