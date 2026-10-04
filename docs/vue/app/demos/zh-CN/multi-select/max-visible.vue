<script setup lang="ts">
  import { ref } from 'vue'
  import { MultiSelect, Stack } from '@hina-ui/vue'

  const tags = ref(['school', 'sf', 'romance', 'mystery'])
  const options = [
    { value: 'school', label: '校园' },
    { value: 'sf', label: '科幻' },
    { value: 'romance', label: '恋爱' },
    { value: 'mystery', label: '悬疑' },
    { value: 'fantasy', label: '奇幻' },
  ]
</script>

<template>
  <Stack class="w-96">
    <MultiSelect v-model="tags" :options="options" :max-visible="1" aria-label="最多一个" />
    <MultiSelect v-model="tags" :options="options" :max-visible="3" aria-label="最多三个" />
  </Stack>
</template>
