<script setup lang="ts">
  import { NumberInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-40">
    <NumberInput size="sm" :default-value="1" aria-label="小号" />
    <NumberInput size="md" :default-value="1" aria-label="中号" />
    <NumberInput size="lg" :default-value="1" aria-label="大号" />
  </Stack>
</template>
