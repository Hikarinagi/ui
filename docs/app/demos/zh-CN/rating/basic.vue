<script setup lang="ts">
  import { ref } from 'vue'
  import { Rating, Stack, Text } from '@hina-ui/vue'

  const score = ref(0)
</script>

<template>
  <Stack gap="sm" align="start">
    <Rating v-model="score" aria-label="评分" />
    <Text tone="muted" size="sm">值：{{ score }}</Text>
  </Stack>
</template>
