<script setup lang="ts">
  import { ref } from 'vue'
  import { Rating, Stack, Text } from '@hina-ui/vue'

  const score = ref(0)
</script>

<template>
  <Stack gap="sm" align="start">
    <Rating v-model="score" aria-label="Rating" />
    <Text tone="muted" size="sm">Value: {{ score }}</Text>
  </Stack>
</template>
