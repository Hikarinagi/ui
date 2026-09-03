<script setup lang="ts">
  import { SegmentedControl, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]
</script>

<template>
  <Stack gap="sm" align="start">
    <SegmentedControl size="sm" :options="options" model-value="day" aria-label="Small" />
    <SegmentedControl size="md" :options="options" model-value="day" aria-label="Medium" />
    <SegmentedControl size="lg" :options="options" model-value="day" aria-label="Large" />
  </Stack>
</template>
