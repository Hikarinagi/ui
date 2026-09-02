<script setup lang="ts">
  import { ref } from 'vue'
  import { Combobox } from '@hina-ui/vue'

  const tag = ref<string | null>(null)
  const tags = [
    {
      label: '题材',
      options: [
        { value: 'school', label: '校园' },
        { value: 'sf', label: '科幻' },
        { value: 'fantasy', label: '奇幻' },
      ],
    },
    {
      label: '形式',
      options: [
        { value: 'kinetic', label: '线性剧情' },
        { value: 'branch', label: '多线分支' },
      ],
    },
  ]
</script>

<template>
  <Combobox v-model="tag" :options="tags" placeholder="搜索标签" aria-label="标签" class="w-64" />
</template>
