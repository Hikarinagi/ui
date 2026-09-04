<script setup lang="ts">
  import { DateRangePicker, Stack } from '@hina-ui/vue'

  const range = { start: '2026-09-04', end: '2026-09-12' }
</script>

<template>
  <Stack class="w-96">
    <DateRangePicker size="sm" :model-value="range" aria-label="小号" />
    <DateRangePicker size="md" :model-value="range" aria-label="中号" />
    <DateRangePicker size="lg" :model-value="range" aria-label="大号" />
  </Stack>
</template>
