<script setup lang="ts">
  import { RangeCalendar, Inline } from '@hina-ui/vue'

  const range = { start: '2026-09-04', end: '2026-09-12' }
</script>

<template>
  <Inline gap="lg" align="start">
    <RangeCalendar :model-value="range" readonly />
    <RangeCalendar :model-value="range" disabled />
  </Inline>
</template>
