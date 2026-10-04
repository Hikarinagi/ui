<script setup lang="ts">
  import { DateRangeField, Stack } from '@hina-ui/vue'

  const range = { start: '2026-09-01', end: '2026-09-30' }
</script>

<template>
  <Stack class="w-96">
    <DateRangeField :model-value="range" invalid aria-label="校验未通过" />
    <DateRangeField :model-value="range" disabled aria-label="已禁用" />
    <DateRangeField :model-value="range" readonly aria-label="只读" />
    <DateRangeField :model-value="range" variant="secondary" aria-label="扁平形态" />
  </Stack>
</template>
