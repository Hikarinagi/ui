<script setup lang="ts">
  import { Stack, TimeField } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-40">
    <TimeField size="sm" model-value="20:00" aria-label="Small" />
    <TimeField size="md" model-value="20:00" aria-label="Medium" />
    <TimeField size="lg" model-value="20:00" aria-label="Large" />
  </Stack>
</template>
