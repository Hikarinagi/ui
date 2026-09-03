<script setup lang="ts">
  import { PinInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm" align="start">
    <PinInput :length="4" model-value="1234" invalid aria-label="校验未通过" />
    <PinInput :length="4" model-value="1234" disabled aria-label="已禁用" />
    <PinInput :length="4" model-value="1234" variant="secondary" aria-label="扁平形态" />
  </Stack>
</template>
