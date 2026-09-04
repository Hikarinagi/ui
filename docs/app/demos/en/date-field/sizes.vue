<script setup lang="ts">
  import { DateField, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <DateField size="sm" model-value="2026-09-04" aria-label="Small" />
    <DateField size="md" model-value="2026-09-04" aria-label="Medium" />
    <DateField size="lg" model-value="2026-09-04" aria-label="Large" />
  </Stack>
</template>
