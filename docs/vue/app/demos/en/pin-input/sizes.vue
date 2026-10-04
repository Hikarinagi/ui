<script setup lang="ts">
  import { PinInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm" align="start">
    <PinInput size="sm" :length="4" model-value="2048" aria-label="Small" />
    <PinInput size="md" :length="4" model-value="2048" aria-label="Medium" />
    <PinInput size="lg" :length="4" model-value="2048" aria-label="Large" />
  </Stack>
</template>
