<script setup lang="ts">
  import { DateRangePicker, Stack } from '@hina-ui/vue'

  const range = { start: '2026-09-04', end: '2026-09-12' }
</script>

<template>
  <Stack class="w-96">
    <DateRangePicker :model-value="range" invalid aria-label="校验未通过" />
    <DateRangePicker :model-value="range" disabled aria-label="已禁用" />
    <DateRangePicker :model-value="range" readonly aria-label="只读" />
    <DateRangePicker :model-value="range" variant="secondary" aria-label="扁平形态" />
  </Stack>
</template>
