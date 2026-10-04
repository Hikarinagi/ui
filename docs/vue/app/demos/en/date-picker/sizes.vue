<script setup lang="ts">
  import { DatePicker, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <DatePicker size="sm" model-value="2026-09-04" aria-label="Small" />
    <DatePicker size="md" model-value="2026-09-04" aria-label="Medium" />
    <DatePicker size="lg" model-value="2026-09-04" aria-label="Large" />
  </Stack>
</template>
