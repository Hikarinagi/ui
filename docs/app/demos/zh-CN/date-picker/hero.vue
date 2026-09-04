<script setup lang="ts">
  import { ref } from 'vue'
  import { DatePicker, Stack, Text } from '@hina-ui/vue'

  const date = ref<string | null>('2026-09-04')
</script>

<template>
  <Stack gap="sm" align="start">
    <DatePicker v-model="date" clearable aria-label="发布日期" class="w-72" />
    <Text tone="muted" size="sm">值：{{ date ?? '空' }}</Text>
  </Stack>
</template>
