<script setup lang="ts">
  import { ref } from 'vue'
  import { Rating, Stack, Text } from '@hina-ui/vue'

  const score = ref(2.5)
</script>

<template>
  <Stack gap="sm" align="start">
    <Rating v-model="score" :step="0.5" aria-label="Rating" />
    <Text tone="muted" size="sm">Value: {{ score }}</Text>
  </Stack>
</template>
