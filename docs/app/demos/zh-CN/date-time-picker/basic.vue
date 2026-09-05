<script setup lang="ts">
  import { ref } from 'vue'
  import { DateTimePicker, Stack, Text } from '@hina-ui/vue'

  const at = ref<string | null>(null)
</script>

<template>
  <Stack gap="sm" align="start">
    <DateTimePicker
      v-model="at"
      placeholder="2026-09-01T09:00"
      aria-label="定时发布"
      class="w-80"
    />
    <Text tone="muted" size="sm">值：{{ at ?? '空' }}</Text>
  </Stack>
</template>
