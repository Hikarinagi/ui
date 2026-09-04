<script setup lang="ts">
  import { ref } from 'vue'
  import { DateField, Stack, Text } from '@hina-ui/vue'

  const at = ref<string | null>('2026-09-04T20:00')
</script>

<template>
  <Stack gap="sm" align="start">
    <DateField v-model="at" granularity="minute" aria-label="定时发布" class="w-80" />
    <Text tone="muted" size="sm">值：{{ at ?? '空' }}</Text>
  </Stack>
</template>
