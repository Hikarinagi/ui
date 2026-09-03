<script setup lang="ts">
  import { ref } from 'vue'
  import { SegmentedControl, Stack, Text } from '@hina-ui/vue'

  const sort = ref('latest')
  const options = [
    { value: 'latest', label: '最新' },
    { value: 'popular', label: '最热' },
    { value: 'rating', label: '评分' },
  ]
</script>

<template>
  <Stack gap="sm" align="start">
    <SegmentedControl v-model="sort" :options="options" aria-label="排序方式" />
    <Text tone="muted" size="sm">当前排序：{{ sort }}</Text>
  </Stack>
</template>
