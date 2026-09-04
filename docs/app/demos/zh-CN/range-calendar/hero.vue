<script setup lang="ts">
  import { ref } from 'vue'
  import { RangeCalendar, Stack, Text, type DateRangeValue } from '@hina-ui/vue'

  const range = ref<DateRangeValue | null>({ start: '2026-09-04', end: '2026-09-12' })
</script>

<template>
  <Stack gap="sm" align="start">
    <RangeCalendar v-model="range" />
    <Text tone="muted" size="sm">
      值：{{ range ? `${range.start ?? '空'} 至 ${range.end ?? '空'}` : '空' }}
    </Text>
  </Stack>
</template>
