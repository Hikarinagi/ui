<script setup lang="ts">
  import { ref } from 'vue'
  import { MultiCombobox, Stack, Text } from '@hina-ui/vue'

  const genres = ref<Array<string | number>>([])
  const options = [
    { value: 'school', label: '校园' },
    { value: 'sf', label: '科幻' },
    { value: 'romance', label: '恋爱' },
    { value: 'mystery', label: '悬疑' },
    { value: 'fantasy', label: '奇幻' },
    { value: 'daily', label: '日常' },
  ]
</script>

<template>
  <Stack gap="sm" class="w-full max-w-sm">
    <MultiCombobox v-model="genres" :options="options" placeholder="输入题材" aria-label="题材" />
    <Text tone="muted" size="sm">{{ genres.length ? genres.join('、') : '还没有选择' }}</Text>
  </Stack>
</template>
