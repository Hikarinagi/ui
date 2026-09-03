<script setup lang="ts">
  import { SegmentedControl, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'all', label: 'All' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'done', label: 'Completed' },
  ]
  const partial = [
    { value: 'all', label: 'All' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'done', label: 'Completed', disabled: true },
  ]
</script>

<template>
  <Stack gap="sm" align="start">
    <SegmentedControl :options="options" model-value="all" disabled aria-label="Group disabled" />
    <SegmentedControl :options="partial" model-value="all" aria-label="One item disabled" />
  </Stack>
</template>
