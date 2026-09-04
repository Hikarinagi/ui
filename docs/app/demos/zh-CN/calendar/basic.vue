<script setup lang="ts">
  import { ref } from 'vue'
  import { Calendar, Stack, Text } from '@hina-ui/vue'

  const date = ref<string | null>(null)
</script>

<template>
  <Stack gap="sm" align="start">
    <Calendar v-model="date" placeholder="2026-09-01" />
    <Text tone="muted" size="sm">值：{{ date ?? '空' }}</Text>
  </Stack>
</template>
