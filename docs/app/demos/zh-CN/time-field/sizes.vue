<script setup lang="ts">
  import { Stack, TimeField } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-40">
    <TimeField size="sm" model-value="20:00" aria-label="小号" />
    <TimeField size="md" model-value="20:00" aria-label="中号" />
    <TimeField size="lg" model-value="20:00" aria-label="大号" />
  </Stack>
</template>
