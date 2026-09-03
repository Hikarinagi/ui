<script setup lang="ts">
  import { SegmentedControl, Stack } from '@hina-ui/vue'

  const options = [
    { value: 'all', label: '全部' },
    { value: 'ongoing', label: '连载中' },
    { value: 'done', label: '已完结' },
  ]
  const partial = [
    { value: 'all', label: '全部' },
    { value: 'ongoing', label: '连载中' },
    { value: 'done', label: '已完结', disabled: true },
  ]
</script>

<template>
  <Stack gap="sm" align="start">
    <SegmentedControl :options="options" model-value="all" disabled aria-label="整组禁用" />
    <SegmentedControl :options="partial" model-value="all" aria-label="单项禁用" />
  </Stack>
</template>
