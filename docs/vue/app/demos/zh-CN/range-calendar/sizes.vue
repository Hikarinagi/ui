<script setup lang="ts">
  import { RangeCalendar, Stack } from '@hina-ui/vue'

  const range = { start: '2026-09-04', end: '2026-09-12' }
</script>

<template>
  <Stack gap="lg" align="start">
    <RangeCalendar size="sm" :model-value="range" />
    <RangeCalendar size="md" :model-value="range" />
    <RangeCalendar size="lg" :model-value="range" />
  </Stack>
</template>
