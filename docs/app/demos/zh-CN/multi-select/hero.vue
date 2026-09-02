<script setup lang="ts">
  import { ref } from 'vue'
  import { MultiSelect } from '@hina-ui/vue'

  const tags = ref(['school', 'sf'])
  const options = [
    { value: 'school', label: '校园' },
    { value: 'sf', label: '科幻' },
    { value: 'romance', label: '恋爱' },
    { value: 'mystery', label: '悬疑' },
    { value: 'fantasy', label: '奇幻' },
  ]
</script>

<template>
  <MultiSelect v-model="tags" :options="options" aria-label="标签" class="w-72" />
</template>
