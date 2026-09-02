<script setup lang="ts">
  import { NumberInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-40">
    <NumberInput invalid :default-value="120" :max="99" aria-label="Invalid" />
    <NumberInput disabled :default-value="3" aria-label="Disabled" />
    <NumberInput readonly :default-value="3" aria-label="Read-only" />
  </Stack>
</template>
