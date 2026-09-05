<script setup lang="ts">
  import { Rating, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack align="start">
    <Rating :model-value="3" size="sm" aria-label="Small" />
    <Rating :model-value="3" size="md" aria-label="Medium" />
    <Rating :model-value="3" size="lg" aria-label="Large" />
  </Stack>
</template>
