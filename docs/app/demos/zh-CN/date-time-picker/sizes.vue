<script setup lang="ts">
  import { DateTimePicker, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-80">
    <DateTimePicker size="sm" model-value="2026-09-04T20:00" aria-label="小号" />
    <DateTimePicker size="md" model-value="2026-09-04T20:00" aria-label="中号" />
    <DateTimePicker size="lg" model-value="2026-09-04T20:00" aria-label="大号" />
  </Stack>
</template>
