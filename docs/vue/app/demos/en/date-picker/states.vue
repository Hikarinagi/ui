<script setup lang="ts">
  import { DatePicker, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <DatePicker model-value="2026-09-04" invalid aria-label="Invalid" />
    <DatePicker model-value="2026-09-04" disabled aria-label="Disabled" />
    <DatePicker model-value="2026-09-04" readonly aria-label="Read only" />
    <DatePicker model-value="2026-09-04" variant="secondary" aria-label="Secondary" />
  </Stack>
</template>
