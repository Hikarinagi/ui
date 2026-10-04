<script setup lang="ts">
  import { Stack, TimeField } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-40">
    <TimeField model-value="20:00" invalid aria-label="Invalid" />
    <TimeField model-value="20:00" disabled aria-label="Disabled" />
    <TimeField model-value="20:00" readonly aria-label="Read only" />
    <TimeField model-value="20:00" variant="secondary" aria-label="Secondary" />
  </Stack>
</template>
