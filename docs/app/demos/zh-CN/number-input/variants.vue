<script setup lang="ts">
  import { NumberInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-xs">
    <NumberInput variant="primary" aria-label="primary" :default-value="1" />
    <NumberInput variant="secondary" aria-label="secondary" :default-value="1" />
    <NumberInput variant="bare" aria-label="bare" :default-value="1" />
  </Stack>
</template>
