<script setup lang="ts">
  import { DateField, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <DateField model-value="2026-09-04" invalid aria-label="Invalid" />
    <DateField model-value="2026-09-04" disabled aria-label="Disabled" />
    <DateField model-value="2026-09-04" readonly aria-label="Read only" />
    <DateField model-value="2026-09-04" variant="secondary" aria-label="Secondary" />
  </Stack>
</template>
