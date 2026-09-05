<script setup lang="ts">
  import { DateTimePicker, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-80">
    <DateTimePicker model-value="2026-09-04T20:00" invalid aria-label="Invalid" />
    <DateTimePicker model-value="2026-09-04T20:00" disabled aria-label="Disabled" />
    <DateTimePicker model-value="2026-09-04T20:00" readonly aria-label="Read only" />
    <DateTimePicker model-value="2026-09-04T20:00" variant="secondary" aria-label="Secondary" />
  </Stack>
</template>
