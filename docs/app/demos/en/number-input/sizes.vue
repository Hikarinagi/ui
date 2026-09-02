<script setup lang="ts">
  import { NumberInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-40">
    <NumberInput size="sm" :default-value="1" aria-label="Small" />
    <NumberInput size="md" :default-value="1" aria-label="Medium" />
    <NumberInput size="lg" :default-value="1" aria-label="Large" />
  </Stack>
</template>
