<script setup lang="ts">
  import { Rating, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack align="start">
    <Rating :model-value="3" size="sm" aria-label="小号" />
    <Rating :model-value="3" size="md" aria-label="中号" />
    <Rating :model-value="3" size="lg" aria-label="大号" />
  </Stack>
</template>
