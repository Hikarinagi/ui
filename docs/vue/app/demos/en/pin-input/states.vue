<script setup lang="ts">
  import { PinInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm" align="start">
    <PinInput :length="4" model-value="1234" invalid aria-label="Invalid" />
    <PinInput :length="4" model-value="1234" disabled aria-label="Disabled" />
    <PinInput :length="4" model-value="1234" variant="secondary" aria-label="Secondary" />
  </Stack>
</template>
