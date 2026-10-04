<script setup lang="ts">
  import { ref } from 'vue'
  import { SegmentedControl, Stack, Text } from '@hina-ui/vue'

  const sort = ref('latest')
  const options = [
    { value: 'latest', label: 'Latest' },
    { value: 'popular', label: 'Popular' },
    { value: 'rating', label: 'Rating' },
  ]
</script>

<template>
  <Stack gap="sm" align="start">
    <SegmentedControl v-model="sort" :options="options" aria-label="Sort by" />
    <Text tone="muted" size="sm">Sorted by: {{ sort }}</Text>
  </Stack>
</template>
