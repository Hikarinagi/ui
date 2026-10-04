<script setup lang="ts">
  import { DateTimePicker, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-80">
    <DateTimePicker size="sm" model-value="2026-09-04T20:00" aria-label="Small" />
    <DateTimePicker size="md" model-value="2026-09-04T20:00" aria-label="Medium" />
    <DateTimePicker size="lg" model-value="2026-09-04T20:00" aria-label="Large" />
  </Stack>
</template>
