<script setup lang="ts">
  import { ref } from 'vue'
  import { Listbox, Stack, Text } from '@hina-ui/vue'

  const tags = ref(['school'])
  const options = [
    { value: 'school', label: '校园' },
    { value: 'sf', label: '科幻' },
    { value: 'romance', label: '恋爱' },
    { value: 'mystery', label: '悬疑' },
  ]
</script>

<template>
  <Stack class="w-56">
    <Listbox v-model="tags" :options="options" multiple aria-label="标签" />
    <Text tone="muted">已选：{{ tags.length ? tags.join('、') : '无' }}</Text>
  </Stack>
</template>
