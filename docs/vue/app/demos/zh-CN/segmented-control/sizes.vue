<script setup lang="ts">
  import { SegmentedControl, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'day', label: '日' },
    { value: 'week', label: '周' },
    { value: 'month', label: '月' },
  ]
</script>

<template>
  <Stack gap="sm" align="start">
    <SegmentedControl size="sm" :options="options" model-value="day" aria-label="小号" />
    <SegmentedControl size="md" :options="options" model-value="day" aria-label="中号" />
    <SegmentedControl size="lg" :options="options" model-value="day" aria-label="大号" />
  </Stack>
</template>
